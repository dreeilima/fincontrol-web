/*
  Warnings:

  - You are about to drop the column `plan` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "plan",
DROP COLUMN "price",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "plan_id" TEXT NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "period" TEXT NOT NULL DEFAULT 'MONTHLY',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "features" TEXT[],
    "benefits" TEXT[],
    "limitations" TEXT[],
    "max_transactions" INTEGER,
    "can_create_categories" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "default_currency" TEXT NOT NULL DEFAULT 'BRL',
    "date_format" TEXT NOT NULL DEFAULT 'dd/MM/yyyy',
    "time_format" TEXT NOT NULL DEFAULT 'HH:mm',
    "decimal_separator" TEXT NOT NULL DEFAULT ',',
    "thousands_separator" TEXT NOT NULL DEFAULT '.',
    "max_categories" INTEGER NOT NULL DEFAULT 50,
    "max_transactions" INTEGER NOT NULL DEFAULT 1000,
    "max_file_size" INTEGER NOT NULL DEFAULT 5,
    "max_users" INTEGER NOT NULL DEFAULT 1000,
    "max_plans" INTEGER NOT NULL DEFAULT 10,
    "max_features_per_plan" INTEGER NOT NULL DEFAULT 20,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_plan_id_idx" ON "subscriptions"("plan_id");

-- RenameForeignKey
ALTER TABLE "subscriptions" RENAME CONSTRAINT "subscriptions_user_id_fkey" TO "subscriptions_user_active_fkey";

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_subscriptions_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "plans" ADD COLUMN "max_transactions" INTEGER,
ADD COLUMN "can_create_categories" BOOLEAN NOT NULL DEFAULT true;

-- Atualizar planos existentes
UPDATE "plans" SET 
  "max_transactions" = CASE 
    WHEN "name" = 'Premium' THEN NULL -- Ilimitado
    ELSE 10 -- Plano gratuito
  END,
  "can_create_categories" = CASE 
    WHEN "name" = 'Premium' THEN true
    ELSE false
  END;
