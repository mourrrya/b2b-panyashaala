-- Rename clerk_user_id to google_id in internal_users table

-- Drop old indexes
DROP INDEX IF EXISTS "internal_users_clerk_user_id_key";
DROP INDEX IF EXISTS "internal_users_clerk_user_id_idx";

-- Rename the column
ALTER TABLE "internal_users" RENAME COLUMN "clerk_user_id" TO "google_id";

-- Create new indexes with correct names
CREATE UNIQUE INDEX "internal_users_google_id_key" ON "internal_users"("google_id");
CREATE INDEX "internal_users_google_id_idx" ON "internal_users"("google_id");
