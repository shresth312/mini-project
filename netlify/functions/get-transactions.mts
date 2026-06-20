import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { transactions } from "../../db/schema.js";
import { eq, desc } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { email } = await req.json();

  if (!email) {
    return Response.json({ success: false, message: "Email required" }, { status: 400 });
  }

  const data = await db
    .select()
    .from(transactions)
    .where(eq(transactions.email, email))
    .orderBy(desc(transactions.date));

  const mapped = data.map((t) => ({
    _id: t.id.toString(),
    email: t.email,
    amount: t.amount,
    type: t.type,
    category: t.category,
    status: t.status,
    date: t.date,
  }));

  return Response.json({ success: true, data: mapped });
};

export const config: Config = {
  path: "/api/get-transactions",
};
