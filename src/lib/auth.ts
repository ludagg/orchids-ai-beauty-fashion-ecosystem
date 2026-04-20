import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "@/db/schema";

const isProd = process.env.NODE_ENV === "production";
const fallbackSecret = !isProd ? "fallback-secret-for-dev-and-ci" : undefined;
const fallbackBaseURL = !isProd ? "http://localhost:3000" : undefined;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || fallbackSecret,
  baseURL: process.env.BETTER_AUTH_URL || process.env.BETTER_AUTH_BASE_URL || fallbackBaseURL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
        ...schema,
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
    }
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      loyaltyPoints: {
        type: "number",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
      github: {
          clientId: process.env.GITHUB_CLIENT_ID || "",
          clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      },
      google: {
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      }
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || process.env.BETTER_AUTH_BASE_URL || "http://localhost:3000"]
});
