// [Jules - Configured secret fallback for Better Auth in non-production environments to allow CI/CD builds to pass]
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "@/db/schema";

const isProduction = process.env.NODE_ENV === 'production';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || (!isProduction ? "dummy_secret_for_development_and_build" : undefined),
  baseURL: process.env.BETTER_AUTH_URL || (!isProduction ? "http://localhost:3000" : undefined),
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
      phone: { type: "string" },
      gender: { type: "string" },
      location: { type: "string" },
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
