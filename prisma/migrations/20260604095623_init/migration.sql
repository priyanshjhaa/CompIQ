-- CreateEnum
CREATE TYPE "Market" AS ENUM ('Global', 'India', 'Hybrid');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'INR');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "market" "Market" NOT NULL,
    "headquarters" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalarySubmission" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "levelRank" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "market" "Market" NOT NULL,
    "currency" "Currency" NOT NULL,
    "base" INTEGER NOT NULL,
    "bonus" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "totalComp" INTEGER NOT NULL,
    "totalCompUsd" DOUBLE PRECISION NOT NULL,
    "yearsExperience" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "normalizedKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalarySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE INDEX "SalarySubmission_companyId_idx" ON "SalarySubmission"("companyId");

-- CreateIndex
CREATE INDEX "SalarySubmission_role_idx" ON "SalarySubmission"("role");

-- CreateIndex
CREATE INDEX "SalarySubmission_level_idx" ON "SalarySubmission"("level");

-- CreateIndex
CREATE INDEX "SalarySubmission_location_idx" ON "SalarySubmission"("location");

-- CreateIndex
CREATE INDEX "SalarySubmission_currency_idx" ON "SalarySubmission"("currency");

-- CreateIndex
CREATE INDEX "SalarySubmission_market_idx" ON "SalarySubmission"("market");

-- CreateIndex
CREATE INDEX "SalarySubmission_totalCompUsd_idx" ON "SalarySubmission"("totalCompUsd");

-- CreateIndex
CREATE INDEX "SalarySubmission_normalizedKey_idx" ON "SalarySubmission"("normalizedKey");

-- AddForeignKey
ALTER TABLE "SalarySubmission" ADD CONSTRAINT "SalarySubmission_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
