-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_password_token" TEXT,
ADD COLUMN     "reset_password_token_expiry" TIMESTAMP(3);
