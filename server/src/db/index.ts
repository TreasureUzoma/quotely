import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { envConfig } from "../config/env";

if (!envConfig.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const sql = neon(envConfig.DATABASE_URL);
export const db = drizzle(sql);
