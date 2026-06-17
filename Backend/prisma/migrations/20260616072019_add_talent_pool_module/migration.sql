-- CreateEnum
CREATE TYPE "TalentPoolStatus" AS ENUM ('IN_POOL', 'INVITED', 'CONSIDERING');

-- CreateTable
CREATE TABLE "talent_pools" (
    "pool_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "TalentPoolStatus" NOT NULL DEFAULT 'IN_POOL',
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "talent_pools_pkey" PRIMARY KEY ("pool_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "talent_pools_company_id_user_id_key" ON "talent_pools"("company_id", "user_id");
