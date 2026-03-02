import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const timelineEvents = sqliteTable("timeline_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  emoji: text("emoji").default("💕"),
  imageUrl: text("image_url"),
  isMonthly: integer("is_monthly", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fromEmail: text("from_email").notNull(),
  fromName: text("from_name").notNull(),
  toEmail: text("to_email").notNull(),
  content: text("content").notNull(),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  scheduledDate: text("scheduled_date"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const disneyPlans = sqliteTable("disney_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").default("nota"),
  imageUrl: text("image_url"),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption"),
  date: text("date"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
