-- CreateTable
CREATE TABLE "budgetSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthlyBudget" DOUBLE PRECISION NOT NULL DEFAULT 5000,
    "savingsGoal" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "budgetSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "budgetSettings_userId_key" ON "budgetSettings"("userId");

-- AddForeignKey
ALTER TABLE "budgetSettings" ADD CONSTRAINT "budgetSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
