-- AlterTable
ALTER TABLE "doses" ADD COLUMN     "product_id" UUID;

-- AlterTable
ALTER TABLE "protocol_substances" ADD COLUMN     "product_id" UUID;

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "substance_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "default_dose" DECIMAL(65,30),
    "dose_unit" VARCHAR(20),
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "patient_id" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_substance_id_idx" ON "products"("substance_id");

-- CreateIndex
CREATE INDEX "products_patient_id_idx" ON "products"("patient_id");

-- CreateIndex
CREATE INDEX "products_is_global_idx" ON "products"("is_global");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_substance_id_fkey" FOREIGN KEY ("substance_id") REFERENCES "substances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_substances" ADD CONSTRAINT "protocol_substances_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doses" ADD CONSTRAINT "doses_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
