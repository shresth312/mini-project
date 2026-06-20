import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { transactions } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { id, email } = await req.json();

  if (!id || !email) {
    return Response.json({ success: false, message: "ID and email required" }, { status: 400 });
  }

  await db
    .delete(transactions)
    .where(and(eq(transactions.id, Number(id)), eq(transactions.email, email)));

  return Response.json({ success: true });
};

export const config: Config = {
  path: "/api/delete-transaction",
};
