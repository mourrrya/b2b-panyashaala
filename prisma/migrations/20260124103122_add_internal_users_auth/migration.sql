-- CreateEnum
CREATE TYPE "InternalUserRole" AS ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER', 'VIEWER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateTable
CREATE TABLE "internal_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "google_id" TEXT,
    "role" "InternalUserRole" NOT NULL DEFAULT 'USER',
    "permissions" TEXT[],
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "full_name" TEXT,
    "department" TEXT,
    "notes" TEXT,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "internal_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "internal_users_email_key" ON "internal_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "internal_users_google_id_key" ON "internal_users"("google_id");

-- CreateIndex
CREATE INDEX "internal_users_email_idx" ON "internal_users"("email");

-- CreateIndex
CREATE INDEX "internal_users_google_id_idx" ON "internal_users"("google_id");