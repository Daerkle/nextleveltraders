#!/usr/bin/env node

import { promises as fs } from "fs";
import { createInterface } from "readline";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnv() {
  console.log("\n🚀 Setting up environment variables for NextLevelTraders...\n");

  try {
    // Read the example file
    const exampleEnv = await fs.readFile(
      join(rootDir, ".env.local.example"),
      "utf-8"
    );

    // Parse current values
    const currentEnv = await fs.readFile(join(rootDir, ".env.local"), "utf-8")
      .catch(() => "");
    
    const currentValues = Object.fromEntries(
      currentEnv
        .split("\n")
        .filter(line => line.includes("="))
        .map(line => {
          const [key, ...values] = line.split("=");
          return [key, values.join("=").replace(/["']/g, "")];
        })
    );

    // Parse example file and prompt for values
    const newEnv = [];
    let currentSection = "";

    for (const line of exampleEnv.split("\n")) {
      // Keep comments and empty lines
      if (line.startsWith("#") || line.trim() === "") {
        if (line.startsWith("# ") && !line.includes(":")) {
          currentSection = line.slice(2);
        }
        newEnv.push(line);
        continue;
      }

      // Parse variable
      const [key, ...defaultValues] = line.split("=");
      const defaultValue = defaultValues.join("=").replace(/["']/g, "");
      
      // Skip if value exists and not empty
      if (currentValues[key] && currentValues[key] !== '""') {
        newEnv.push(`${key}="${currentValues[key]}"`);
        continue;
      }

      // Prompt for required values
      if (
        key.includes("SECRET") ||
        key.includes("KEY") ||
        key.includes("URL") ||
        key.includes("TOKEN")
      ) {
        console.log(`\n${currentSection}:`);
        const value = await question(`Enter ${key} (default: ${defaultValue}): `);
        newEnv.push(`${key}="${value || defaultValue}"`);
      } else {
        // Use default for optional values
        newEnv.push(line);
      }
    }

    // Write the new .env file
    await fs.writeFile(
      join(rootDir, ".env.local"),
      newEnv.join("\n")
    );

    console.log("\n✅ Environment variables have been set up successfully!");
    console.log("\nℹ️ You can edit them anytime in .env.local");

  } catch (error) {
    console.error("\n❌ Error setting up environment variables:", error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Add development keys for quick setup
const devKeys = {
  UPSTASH_REDIS_REST_URL: "https://fake-redis-url.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "fake-redis-token",
  CLERK_SECRET_KEY: "sk_test_fake",
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_fake",
  STRIPE_SECRET_KEY: "sk_test_fake",
  STRIPE_WEBHOOK_SECRET: "whsec_fake",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_fake",
};

// Add command line options
const args = process.argv.slice(2);
if (args.includes("--dev")) {
  console.log("\n🔧 Setting up development environment...");
  const envContent = Object.entries(devKeys)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n");
  
  fs.writeFile(join(rootDir, ".env.local"), envContent)
    .then(() => console.log("✅ Development environment set up successfully!"))
    .catch(console.error)
    .finally(() => process.exit());
} else {
  setupEnv();
}