// SPIKE only: proves the adapter and Next handler type-check and build here.
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
export const auth = betterAuth({
  database: mongodbAdapter(client.db(process.env.DB_NAME || "deejpotter_dev"), { client }),
  emailAndPassword: { enabled: true },
  socialProviders: { google: { clientId: process.env.GOOGLE_CLIENT_ID || "x", clientSecret: process.env.GOOGLE_CLIENT_SECRET || "x" } },
  user: { modelName: "users" },
  plugins: [genericOAuth({ config: [{ providerId: "clerk", clientId: "x", clientSecret: "x", discoveryUrl: "https://example.test/.well-known/openid-configuration" }] }), nextCookies()],
});
