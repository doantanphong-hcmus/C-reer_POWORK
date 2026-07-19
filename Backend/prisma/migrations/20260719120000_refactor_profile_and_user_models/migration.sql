-- AlterTable
ALTER TABLE "users" ADD COLUMN "university" TEXT,
ADD COLUMN "year" TEXT,
ADD COLUMN "primary_skills" JSONB;

-- AlterTable
ALTER TABLE "verified_evidences" ADD COLUMN "solution_url" TEXT,
ADD COLUMN "general_comment" TEXT,
ADD COLUMN "rubric_breakdown" JSONB;
