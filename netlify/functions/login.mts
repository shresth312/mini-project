import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { username, password } = await req.json();

  if (!username || !password) {
    return Response.json({ success: false, message: "Missing credentials" }, { status: 400 });
  }

  const [user] = await db.select().from(users).where(eq(users.username, username));

  if (!user) {
    return Response.json({ success: false, message: "Wrong credentials" });
  }

  const match = await bcryptjs.compare(password, user.password);
  if (!match) {
    return Response.json({ success: false, message: "Wrong credentials" });
  }

  return Response.json({ success: true, user: { username: user.username, email: user.email } });
};

export const config: Config = {
  path: "/api/login",
};
