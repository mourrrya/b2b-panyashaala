#!/usr/bin/env node
/**
 * Creates a Prisma migration without requiring a shadow database.
 * Usage: node prisma/createMigration.js <migration-name>
 * Example: node prisma/createMigration.js add_user_table
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const migrationName = process.argv[2];

if (!migrationName) {
  console.error("❌ Please provide a migration name");
  console.error("Usage: node prisma/createMigration.js <migration-name>");
  console.error("Example: node prisma/createMigration.js add_user_table");
  process.exit(1);
}

// Sanitize migration name (replace spaces with underscores, remove special chars)
const sanitizedName = migrationName
  .toLowerCase()
  .replace(/\s+/g, "_")
  .replace(/[^a-z0-9_]/g, "");

if (!sanitizedName) {
  console.error("❌ Invalid migration name");
  process.exit(1);
}

// Generate timestamp in format YYYYMMDDHHMMSS
const now = new Date();
const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 14);

const migrationFolder = `${timestamp}_${sanitizedName}`;
const migrationsPath = join(process.cwd(), "prisma", "migrations");
const migrationPath = join(migrationsPath, migrationFolder);
const migrationFile = join(migrationPath, "migration.sql");

console.log("🔍 Checking for schema changes...\n");

try {
  // Get the diff SQL
  const diffCommand =
    "npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script";
  const sql = execSync(diffCommand, { encoding: "utf-8" });

  // Check if there are any changes
  if (sql.includes("-- This is an empty migration")) {
    console.log("✅ No schema changes detected. Database is in sync with Prisma schema.");
    process.exit(0);
  }

  console.log("📝 SQL to be applied:\n");
  console.log(sql);
  console.log("\n");

  // Create migration folder
  if (!existsSync(migrationPath)) {
    mkdirSync(migrationPath, { recursive: true });
  }

  // Write migration file
  writeFileSync(migrationFile, sql);

  console.log(`✅ Migration created: prisma/migrations/${migrationFolder}/migration.sql`);
  console.log("\n📌 Next steps:");
  console.log("   1. Review the migration SQL above");
  console.log("   2. Run: pnpm db:migrate:deploy");
  console.log("   3. Run: pnpm db:generate");
} catch (error) {
  console.error("❌ Failed to create migration:", error.message);
  process.exit(1);
}
