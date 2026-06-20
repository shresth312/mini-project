import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq, or } from "drizzle-orm";
import bcryptjs from "bcryptjs";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return Response.json({ success: false, message: "All fields required" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)));

  if (existing.length > 0) {
    return Response.json({ success: false, message: "User already exists" });
  }

  const hashed = await bcryptjs.hash(password, 10);
  await db.insert(users).values({ username, email, password: hashed });

  return Response.json({ success: true, message: "Account created!" });
};

export const config: Config = {
  path: "/api/signup",
};
