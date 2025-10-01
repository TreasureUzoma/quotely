export const envConfig = {
  JWT_SECRET: process.env.JWT_SECRET || "",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  DATABASE_URL: process.env.DATABASE_URL || "",
  API_URL: process.env.PROD_URL || "",
};
