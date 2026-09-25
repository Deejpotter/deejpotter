/**
 * db-users.ts — User management synced from Clerk
 *
 * Handles Clerk webhook events to keep the local users collection
 * in sync with Clerk's user database.
 */

import { getCollection } from "./db";
import { UserDocSchema } from "./db-schemas";

export async function upsertUser(data: {
  clerkId: string;
  email: string;
  name: string;
  role?: "customer" | "admin";
}) {
  const col = await getCollection("users");
  const now = new Date().toISOString();

  const doc = UserDocSchema.parse({
    clerkId: data.clerkId,
    email: data.email.toLowerCase().trim(),
    name: data.name,
    role: data.role || "customer",
    createdAt: now,
    updatedAt: now,
  });

  // Only change the role when one is passed in explicitly. Quote submissions
  // and the Clerk webhook call this without a role, and must not demote an
  // existing admin back to "customer". New users default to "customer".
  await col.updateOne(
    { clerkId: doc.clerkId },
    {
      $set: {
        email: doc.email,
        name: doc.name,
        ...(data.role ? { role: data.role } : {}),
        updatedAt: now,
      },
      $setOnInsert: {
        clerkId: doc.clerkId,
        createdAt: now,
        ...(data.role ? {} : { role: "customer" }),
      },
    },
    { upsert: true },
  );

  return doc;
}

export async function getUserByClerkId(clerkId: string) {
  const col = await getCollection("users");
  return col.findOne({ clerkId });
}

export async function getUserByEmail(email: string) {
  const col = await getCollection("users");
  return col.findOne({ email: email.toLowerCase().trim() });
}

export async function deleteUser(clerkId: string) {
  const col = await getCollection("users");
  await col.deleteOne({ clerkId });
}

export async function isAdmin(clerkId: string): Promise<boolean> {
  const user = await getUserByClerkId(clerkId);
  return user?.role === "admin";
}

export async function setUserRole(
  clerkId: string,
  role: "customer" | "admin",
) {
  const col = await getCollection("users");
  await col.updateOne(
    { clerkId },
    { $set: { role, updatedAt: new Date().toISOString() } },
  );
}
