// SPIKE (auth plan phase 0.3), not for merge. Runs Better Auth 1.7 with the MongoDB
// adapter against a local replica set restored from the production backup, and
// records how it stores users and whether Clerk (OIDC) sign-ins link safely.
//
// Usage: node scripts/spike/better-auth-mongo.mjs <backup-dir>
// Nothing touches Atlas. The mock OIDC provider stands in for Clerk.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { MongoClient, BSON, ObjectId } from "mongodb";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { OAuth2Server } from "oauth2-mock-server";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { genericOAuth } from "better-auth/plugins";
import { toNodeHandler } from "better-auth/node";

const backupDir = process.argv[2];
const APP = "http://localhost:3100";
const results = [];
const record = (name, pass, detail = "") => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `\n      ${detail}` : ""}`);
};
const note = (text) => console.log(`NOTE  ${text}`);

// ---- Restore the production backup into a local replica set ----------------
const rs = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
const client = new MongoClient(rs.getUri());
await client.connect();
const db = client.db("deejpotter");
for (const file of fs.readdirSync(backupDir).filter((f) => f.endsWith(".json") && !f.includes(".indexes") && f !== "manifest.json")) {
  const name = file.replace(/\.json$/, "");
  const docs = BSON.EJSON.parse(fs.readFileSync(path.join(backupDir, file), "utf8"), { relaxed: false });
  if (docs.length) await db.collection(name).insertMany(docs);
  for (const ix of JSON.parse(fs.readFileSync(path.join(backupDir, `${name}.indexes.json`), "utf8"))) {
    if (ix.name === "_id_") continue;
    const { key, name: ixName, v, ns, ...opts } = ix;
    await db.collection(name).createIndex(key, { name: ixName, ...opts });
  }
}
const users = db.collection("users");
const existing = await users.findOne({});
note(`restored production; existing user _id is ${existing._id.constructor.name}, createdAt is ${typeof existing.createdAt}`);

// ---- Mock Clerk ----------------------------------------------------------------
let claims = {};
const idp = new OAuth2Server();
await idp.issuer.keys.generate("RS256");
idp.service.on("beforeTokenSigning", (t) => Object.assign(t.payload, claims));
idp.service.on("beforeUserinfo", (res) => { res.body = { ...claims }; });
await idp.start(8090, "localhost");

// ---- Better Auth, reusing the existing users collection --------------------------
const auth = betterAuth({
  baseURL: APP,
  secret: "spike-secret-spike-secret-spike-secret-0123",
  database: mongodbAdapter(db, { client }),
  emailAndPassword: { enabled: true },
  user: { modelName: "users" },
  account: { accountLinking: { enabled: true } },
  rateLimit: { enabled: false },
  plugins: [
    genericOAuth({
      config: [{
        providerId: "clerk",
        clientId: "spike",
        clientSecret: "spike",
        discoveryUrl: "http://localhost:8090/.well-known/openid-configuration",
        scopes: ["openid", "email", "profile"],
      }],
    }),
  ],
});
const server = http.createServer(toNodeHandler(auth)).listen(3100);

const post = (p, body, cookie = "") =>
  fetch(`${APP}/api/auth${p}`, { method: "POST", headers: { "Content-Type": "application/json", Origin: APP, cookie }, body: JSON.stringify(body) });
const cookiesOf = (res) => (res.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
const session = async (cookie) => (await fetch(`${APP}/api/auth/get-session`, { headers: { cookie } })).json();

// ---- 1. Email sign-up: what does a new user look like? --------------------------
let res = await post("/sign-up/email", { email: "spike1@example.test", password: "correct-horse-battery", name: "Spike One" });
record("email sign-up works with modelName users", res.ok, `status ${res.status}`);
const u1 = await users.findOne({ email: "spike1@example.test" });
if (u1) note(`new user fields: ${Object.entries(u1).map(([k, v]) => `${k}:${v?.constructor?.name ?? typeof v}`).join(", ")}`);
note(`collections now: ${(await db.listCollections().toArray()).map((c) => c.name).sort().join(", ")}`);

// ---- 2. Second sign-up against the existing unique clerkId index ----------------
res = await post("/sign-up/email", { email: "spike2@example.test", password: "correct-horse-battery", name: "Spike Two" });
const secondBody = await res.text();
record("second sign-up with the existing clerkId unique index", res.ok, `status ${res.status} ${res.ok ? "" : secondBody.slice(0, 160)}`);
if (!res.ok) {
  // The fix to carry into phase 2: unique only where clerkId exists.
  await users.dropIndex("clerkId_1");
  await users.createIndex({ clerkId: 1 }, { name: "clerkId_1", unique: true, partialFilterExpression: { clerkId: { $type: "string" } } });
  res = await post("/sign-up/email", { email: "spike2@example.test", password: "correct-horse-battery", name: "Spike Two" });
  record("second sign-up after making the clerkId index partial", res.ok, `status ${res.status}`);
}

// ---- 3. Email sign-in and session --------------------------------------------
res = await post("/sign-in/email", { email: "spike1@example.test", password: "correct-horse-battery" });
const s1 = await session(cookiesOf(res));
record("email sign-in returns a session for the user", res.ok && s1?.user?.email === "spike1@example.test");
res = await post("/sign-in/email", { email: "spike1@example.test", password: "wrong-password-here" });
record("wrong password refused", res.status === 401, `status ${res.status}`);

// ---- 4. Clerk (OIDC) linking scenarios, as in the Day Planner ------------------
async function oidcSignIn() {
  const jar = new Map();
  const keep = (r) => { for (const c of r.headers.getSetCookie?.() ?? []) { const [pair] = c.split(";"); const i = pair.indexOf("="); jar.set(pair.slice(0, i), pair.slice(i + 1)); } };
  const cookie = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
  const start = await post("/sign-in/social", { provider: "clerk", callbackURL: "/done", errorCallbackURL: "/failed", disableRedirect: true });
  keep(start);
  let url = (await start.json()).url;
  for (let hop = 0; hop < 6; hop++) {
    const onApp = url.startsWith(APP);
    const r = await fetch(url, { redirect: "manual", headers: onApp ? { cookie: cookie() } : {} });
    if (onApp) keep(r);
    const loc = r.headers.get("location");
    if (!loc) return { final: url, cookie: cookie() };
    url = new URL(loc, url).href;
    if (url.startsWith(`${APP}/done`) || url.startsWith(`${APP}/failed`)) return { final: url.replace(APP, ""), cookie: cookie() };
  }
  return { final: url, cookie: cookie() };
}

const accounts = db.collection("account");
const scenarios = [
  { name: "A. Clerk verified, local user NOT verified -> refused", idp: true, local: false, link: false },
  { name: "B. Clerk NOT verified, local user verified -> refused", idp: false, local: true, link: false },
  { name: "C. Both verified -> linked to the existing user", idp: true, local: true, link: true },
];
for (const s of scenarios) {
  await db.collection("session").deleteMany({});
  await accounts.deleteMany({ providerId: "clerk" });
  await users.updateOne({ _id: existing._id }, { $set: { emailVerified: s.local } });
  claims = { sub: "user_mock_1", name: existing.name, email: existing.email, email_verified: s.idp };
  const { final, cookie } = await oidcSignIn();
  const acct = await accounts.findOne({ providerId: "clerk" });
  const linkedId = acct?.userId?.toString();
  const linked = linkedId === existing._id.toString();
  const dupes = await users.countDocuments({ email: existing.email });
  let detail = `ended at ${final}; users with that email: ${dupes}`;
  if (linked) {
    const s2 = await session(cookie);
    detail += `; session user ${s2?.user?.id === existing._id.toString() ? "is the existing row" : "MISSING"}, createdAt ${JSON.stringify(s2?.user?.createdAt)}`;
  }
  record(s.name, linked === s.link && dupes === 1, detail);
}

// D. A new email creates a new user.
await accounts.deleteMany({ providerId: "clerk" });
claims = { sub: "user_mock_2", name: "New Person", email: "newperson@example.test", email_verified: true };
const d = await oidcSignIn();
record("D. New email via Clerk creates a new user", Boolean(await users.findOne({ email: "newperson@example.test" })), `ended at ${d.final}`);

// ---- 5. What existing data still reads correctly ---------------------------------
const after = await users.findOne({ _id: existing._id });
record("existing user keeps clerkId, role and ISO dates", after.clerkId === existing.clerkId && after.role === existing.role && typeof after.createdAt === "string");
const acct = await accounts.findOne({ providerId: "clerk" });
note(`account.userId stored as ${acct?.userId?.constructor?.name}`);
const quotes = await db.collection("quotes").find().toArray();
note(`quotes keep userId as ${quotes.map((q) => (q.userId === null ? "null" : typeof q.userId)).join(", ")} (Clerk ids); /account lists by email`);

server.close(); await idp.stop(); await client.close(); await rs.stop();
const failed = results.filter((r) => !r.pass).map((r) => r.name);
console.log(failed.length ? `\n${failed.length} check(s) failed: ${failed.join(" | ")}` : "\nAll checks passed");
process.exit(0);
