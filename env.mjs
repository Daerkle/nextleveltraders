import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().url(),
    
    // Redis
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    
    // Auth
    CLERK_SECRET_KEY: z.string().min(1),
    
    // Stripe
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    
    // Environment
    NODE_ENV: z.enum(["development", "test", "production"]),
    
    // Rate Limiting
    RATE_LIMIT_MAX: z.coerce.number().positive().default(60),
    RATE_LIMIT_WINDOW: z.coerce.number().positive().default(60),
  },
  
  client: {
    // Public URLs
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    
    // Auth
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    
    // Stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    
    // Features
    NEXT_PUBLIC_ENABLE_TEST_FEATURES: z.enum(["true", "false"]).default("false"),
    
    // Analytics
    NEXT_PUBLIC_GA_ID: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    
    // Version
    NEXT_PUBLIC_APP_VERSION: z.string().default("0.0.0"),
    NEXT_PUBLIC_BUILD_TIME: z.string().default(new Date().toISOString()),
  },
  
  runtimeEnv: {
    // Server
    DATABASE_URL: process.env.DATABASE_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW,
    
    // Client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_ENABLE_TEST_FEATURES: process.env.NEXT_PUBLIC_ENABLE_TEST_FEATURES,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME,
  },
  
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

// Re-export for better IDE support
export const {
  // Server
  DATABASE_URL,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
  CLERK_SECRET_KEY,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  NODE_ENV,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW,
  
  // Client
  NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_ENABLE_TEST_FEATURES,
  NEXT_PUBLIC_GA_ID,
  NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_APP_VERSION,
  NEXT_PUBLIC_BUILD_TIME,
} = env;

// Helper functions
export const isDev = NODE_ENV === "development";
export const isProd = NODE_ENV === "production";
export const isTest = NODE_ENV === "test";
export const testFeaturesEnabled = NEXT_PUBLIC_ENABLE_TEST_FEATURES === "true";