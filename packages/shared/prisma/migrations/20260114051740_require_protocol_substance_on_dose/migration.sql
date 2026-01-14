/*
  Warnings:

  - Made the column `protocol_substance_id` on table `doses` required. This step will fail if there are existing NULL values in that column.

*/
-- Delete any orphaned doses without protocol_substance_id (dev cleanup)
DELETE FROM "doses" WHERE "protocol_substance_id" IS NULL;

-- DropForeignKey
ALTER TABLE "doses" DROP CONSTRAINT "doses_protocol_substance_id_fkey";

-- AlterTable
ALTER TABLE "doses" ALTER COLUMN "protocol_substance_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "doses" ADD CONSTRAINT "doses_protocol_substance_id_fkey" FOREIGN KEY ("protocol_substance_id") REFERENCES "protocol_substances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
