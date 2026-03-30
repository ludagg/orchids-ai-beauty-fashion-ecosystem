import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  // [Jules - Ajout des fallback pour le build CI/CD selon la mémoire et best practices]
  secret: process.env.BETTER_AUTH_SECRET || (process.env.NODE_ENV !== "production" ? "dummy-secret-for-dev" : undefined),
  baseURL: process.env.BETTER_AUTH_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined),
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
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"]
});
