-- AlterTable
ALTER TABLE "substances" ADD COLUMN     "fda_approved_for" TEXT[],
ADD COLUMN     "fda_label_url" VARCHAR(500),
ADD COLUMN     "fda_status" VARCHAR(50),
ADD COLUMN     "references" JSONB;
