import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userAuthMethodEnum = pgEnum("user_auth_method", [
  "email",
  "google",
  "github",
]);
export const userStatusEnum = pgEnum("user_status", [
  "active",
  "suspended",
  "read-only",
]);
export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin",
  "superadmin",
]);
export const userSubscriptionEnum = pgEnum("user_subscription", [
  "free",
  "paid",
  "enterprise",
]);

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
  authMethod: userAuthMethodEnum("auth_method").default("google"),
  status: userStatusEnum("status").default("active"),
  role: userRoleEnum("role").default("user"),
  subscriptionType: userSubscriptionEnum("subscription_type").default("free"),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  content: text("content").notNull(),
  bgColor: text("bg_color").notNull(),
  createdByUUID: uuid("created_by_uuid")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
