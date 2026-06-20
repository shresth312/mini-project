import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { transactions } from "../../db/schema.js";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { email, amount, type, category, status } = await req.json();

  if (!email || !amount || !type || !category || !status) {
    return Response.json({ success: false, message: "All fields required" }, { status: 400 });
  }

  await db.insert(transactions).values({
    email,
    amount: Number(amount),
    type,
    category,
    status,
  });

  return Response.json({ success: true });
};

export const config: Config = {
  path: "/api/add-transaction",
};
