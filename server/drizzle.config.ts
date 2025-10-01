import { defineConfig } from "drizzle-kit";
import { envConfig } from "./src/config/env";

const url = envConfig.DATABASE_URL || "";

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/db/schema.ts", "./src/db/auth-schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: url,
  },
});
