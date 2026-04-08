// [Jules - Secure auth configuration and add missing user fields]
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
  secret: process.env.BETTER_AUTH_SECRET || (process.env.NODE_ENV !== 'production' ? 'development-secret-only' : undefined),
  baseURL: process.env.BETTER_AUTH_URL || (process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : undefined),
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
      bio: {
        type: "string",
      },
      isSuspended: {
        type: "boolean",
      },
      onboardingCompleted: {
        type: "boolean",
      },
      gender: {
        type: "string",
      },
      location: {
        type: "string",
      },
      style: {
        type: "string",
      },
      budget: {
        type: "string",
      },
      height: {
        type: "string",
      },
      weight: {
        type: "string",
      },
      bodyType: {
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
  trustedOrigins: [process.env.BETTER_AUTH_URL || (process.env.NODE_ENV !== 'production' ? "http://localhost:3000" : "")]
});
