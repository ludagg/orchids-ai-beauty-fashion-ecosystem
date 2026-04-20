import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
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
  secret: process.env.NODE_ENV !== "production" ? process.env.BETTER_AUTH_SECRET || "fallback_secret" : process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NODE_ENV !== "production" ? process.env.BETTER_AUTH_URL || "http://localhost:3000" : process.env.BETTER_AUTH_URL,
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      loyaltyPoints: {
        type: "number",
      },
      phone: {
        type: "string",
      },
      gender: {
        type: "string",
      },
      location: {
        type: "string",
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
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"]
});
// [Jules - Fix Better Auth fallback config & adding additionalFields]
