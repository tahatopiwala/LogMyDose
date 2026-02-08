/*
  Warnings:

  - You are about to drop the column `tenant_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `is_global` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `tenant_ids` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `account_type` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `clinic_control_level` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `clinic_id` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `clinic_linked_at` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `consent_signed_at` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `shared_with_clinic` on the `progress_entries` table. All the data in the column will be lost.
  - You are about to drop the column `created_by_clinic_id` on the `protocol_templates` table. All the data in the column will be lost.
  - You are about to drop the column `approved_at` on the `protocols` table. All the data in the column will be lost.
  - You are about to drop the column `approved_by` on the `protocols` table. All the data in the column will be lost.
  - You are about to drop the column `clinic_can_modify` on the `protocols` table. All the data in the column will be lost.
  - You are about to drop the column `clinic_id` on the `protocols` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `protocols` table. All the data in the column will be lost.
  - You are about to drop the `clinic_invitations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tenants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "clinic_invitations" DROP CONSTRAINT "clinic_invitations_clinic_id_fkey";

-- DropForeignKey
ALTER TABLE "doses" DROP CONSTRAINT "doses_protocol_substance_id_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_clinic_id_fkey";

-- DropForeignKey
ALTER TABLE "protocol_templates" DROP CONSTRAINT "protocol_templates_created_by_clinic_id_fkey";

-- DropForeignKey
ALTER TABLE "protocols" DROP CONSTRAINT "protocols_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "protocols" DROP CONSTRAINT "protocols_clinic_id_fkey";

-- DropForeignKey
ALTER TABLE "protocols" DROP CONSTRAINT "protocols_provider_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_tenant_id_fkey";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "tenant_id",
DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "content" DROP COLUMN "is_global",
DROP COLUMN "tenant_ids";

-- AlterTable
ALTER TABLE "doses" ADD COLUMN     "fasting_state" VARCHAR(20),
ADD COLUMN     "injection_depth" VARCHAR(20),
ADD COLUMN     "meal_fat_content" VARCHAR(20),
ADD COLUMN     "needle_gauge" VARCHAR(10),
ADD COLUMN     "taken_with_food" BOOLEAN,
ADD COLUMN     "time_of_day" VARCHAR(20),
ADD COLUMN     "vial_id" UUID,
ALTER COLUMN "protocol_substance_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "account_type",
DROP COLUMN "clinic_control_level",
DROP COLUMN "clinic_id",
DROP COLUMN "clinic_linked_at",
DROP COLUMN "consent_signed_at";

-- AlterTable
ALTER TABLE "progress_entries" DROP COLUMN "shared_with_clinic";

-- AlterTable
ALTER TABLE "protocol_templates" DROP COLUMN "created_by_clinic_id";

-- AlterTable
ALTER TABLE "protocols" DROP COLUMN "approved_at",
DROP COLUMN "approved_by",
DROP COLUMN "clinic_can_modify",
DROP COLUMN "clinic_id",
DROP COLUMN "provider_id";

-- DropTable
DROP TABLE "clinic_invitations";

-- DropTable
DROP TABLE "tenants";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "vials" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "reconstituted_at" TIMESTAMP(3),
    "diluent_type" VARCHAR(50),
    "diluent_volume_ml" DECIMAL(65,30),
    "concentration_mcg_ml" DECIMAL(65,30),
    "vial_amount_mcg" DECIMAL(65,30),
    "remaining_amount_mcg" DECIMAL(65,30),
    "lot_number" VARCHAR(100),
    "manufacturer_exp_date" DATE,
    "calculated_exp_date" DATE,
    "storage_location" VARCHAR(100),
    "requires_refrigeration" BOOLEAN NOT NULL DEFAULT true,
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "depleted_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biometric_entries" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "dose_id" UUID,
    "metric_type" VARCHAR(50) NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "unit" VARCHAR(20),
    "notes" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biometric_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cycles" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "protocol_substance_id" UUID NOT NULL,
    "cycle_number" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "on_weeks" INTEGER NOT NULL,
    "off_weeks" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'on',
    "current_week" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "titration_phases" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "protocol_substance_id" UUID NOT NULL,
    "phase_number" INTEGER NOT NULL,
    "dose_amount" DECIMAL(65,30) NOT NULL,
    "dose_unit" VARCHAR(20) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "weeks_at_dose" INTEGER NOT NULL,
    "reason" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "target_dose" DECIMAL(65,30),
    "is_maintenance_phase" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "titration_phases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "vials_patient_id_idx" ON "vials"("patient_id");

-- CreateIndex
CREATE INDEX "vials_product_id_idx" ON "vials"("product_id");

-- CreateIndex
CREATE INDEX "vials_status_idx" ON "vials"("status");

-- CreateIndex
CREATE INDEX "biometric_entries_patient_id_idx" ON "biometric_entries"("patient_id");

-- CreateIndex
CREATE INDEX "biometric_entries_metric_type_idx" ON "biometric_entries"("metric_type");

-- CreateIndex
CREATE INDEX "biometric_entries_recorded_at_idx" ON "biometric_entries"("recorded_at");

-- CreateIndex
CREATE INDEX "biometric_entries_dose_id_idx" ON "biometric_entries"("dose_id");

-- CreateIndex
CREATE INDEX "cycles_patient_id_idx" ON "cycles"("patient_id");

-- CreateIndex
CREATE INDEX "cycles_protocol_substance_id_idx" ON "cycles"("protocol_substance_id");

-- CreateIndex
CREATE INDEX "cycles_status_idx" ON "cycles"("status");

-- CreateIndex
CREATE INDEX "titration_phases_patient_id_idx" ON "titration_phases"("patient_id");

-- CreateIndex
CREATE INDEX "titration_phases_protocol_substance_id_idx" ON "titration_phases"("protocol_substance_id");

-- CreateIndex
CREATE INDEX "titration_phases_status_idx" ON "titration_phases"("status");

-- CreateIndex
CREATE INDEX "doses_vial_id_idx" ON "doses"("vial_id");

-- AddForeignKey
ALTER TABLE "vials" ADD CONSTRAINT "vials_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vials" ADD CONSTRAINT "vials_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doses" ADD CONSTRAINT "doses_protocol_substance_id_fkey" FOREIGN KEY ("protocol_substance_id") REFERENCES "protocol_substances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doses" ADD CONSTRAINT "doses_vial_id_fkey" FOREIGN KEY ("vial_id") REFERENCES "vials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biometric_entries" ADD CONSTRAINT "biometric_entries_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biometric_entries" ADD CONSTRAINT "biometric_entries_dose_id_fkey" FOREIGN KEY ("dose_id") REFERENCES "doses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cycles" ADD CONSTRAINT "cycles_protocol_substance_id_fkey" FOREIGN KEY ("protocol_substance_id") REFERENCES "protocol_substances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titration_phases" ADD CONSTRAINT "titration_phases_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "titration_phases" ADD CONSTRAINT "titration_phases_protocol_substance_id_fkey" FOREIGN KEY ("protocol_substance_id") REFERENCES "protocol_substances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
