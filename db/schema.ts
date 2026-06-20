import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  username: text().notNull().unique(),
  email: text().notNull().unique(),
  password: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial().primaryKey(),
  email: text().notNull(),
  amount: integer().notNull(),
  type: text().notNull(),
  category: text().notNull(),
  status: text().notNull(),
  date: timestamp().defaultNow(),
});
