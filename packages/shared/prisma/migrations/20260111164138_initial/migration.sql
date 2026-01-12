-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "branding" JSONB,
    "subscription_tier" VARCHAR(50),
    "subscription_status" VARCHAR(50),
    "stripe_customer_id" VARCHAR(255),
    "settings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "credentials" VARCHAR(255),
    "permissions" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "token_version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "date_of_birth" DATE,
    "phone" VARCHAR(20),
    "account_type" VARCHAR(50) NOT NULL DEFAULT 'd2c',
    "subscription_tier" VARCHAR(50),
    "subscription_status" VARCHAR(50),
    "stripe_customer_id" VARCHAR(255),
    "clinic_id" UUID,
    "clinic_linked_at" TIMESTAMP(3),
    "clinic_control_level" VARCHAR(50),
    "consent_signed_at" TIMESTAMP(3),
    "settings" JSONB,
    "token_version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinic_invitations" (
    "id" UUID NOT NULL,
    "clinic_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "invite_code" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinic_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "substance_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "substance_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "substances" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "aliases" TEXT[],
    "subcategory" VARCHAR(100),
    "default_dose" DECIMAL(65,30),
    "dose_unit" VARCHAR(20),
    "default_frequency" VARCHAR(50),
    "administration_route" VARCHAR(50),
    "preparation_instructions" TEXT,
    "storage_temp" VARCHAR(50),
    "storage_notes" TEXT,
    "shelf_life_days" INTEGER,
    "shelf_life_reconstituted_days" INTEGER,
    "requires_cycling" BOOLEAN NOT NULL DEFAULT false,
    "common_cycle_on_weeks" INTEGER,
    "common_cycle_off_weeks" INTEGER,
    "contraindications" TEXT[],
    "common_side_effects" TEXT[],
    "interactions" TEXT[],
    "onset_timeline" VARCHAR(100),
    "is_prescription_required" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "substances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocol_templates" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category_id" UUID,
    "substance_id" UUID,
    "default_dose" DECIMAL(65,30),
    "dose_unit" VARCHAR(20),
    "frequency" VARCHAR(50),
    "titration_plan" JSONB,
    "cycle_on_weeks" INTEGER,
    "cycle_off_weeks" INTEGER,
    "difficulty_level" VARCHAR(50),
    "tags" TEXT[],
    "use_count" INTEGER NOT NULL DEFAULT 0,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_by_clinic_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "protocol_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocols" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "source" VARCHAR(50) NOT NULL,
    "template_id" UUID,
    "clinic_id" UUID,
    "provider_id" UUID,
    "clinic_can_modify" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "start_date" DATE,
    "end_date" DATE,
    "notes" TEXT,
    "approved_at" TIMESTAMP(3),
    "approved_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "protocols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "protocol_substances" (
    "id" UUID NOT NULL,
    "protocol_id" UUID NOT NULL,
    "substance_id" UUID NOT NULL,
    "dose" DECIMAL(65,30) NOT NULL,
    "dose_unit" VARCHAR(20),
    "frequency" VARCHAR(50),
    "schedule" JSONB,
    "titration_plan" JSONB,
    "cycle_on_weeks" INTEGER,
    "cycle_off_weeks" INTEGER,
    "current_supply_amount" DECIMAL(65,30),
    "supply_unit" VARCHAR(20),
    "supply_expiration_date" DATE,
    "notes" TEXT,

    CONSTRAINT "protocol_substances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doses" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "protocol_substance_id" UUID,
    "substance_id" UUID NOT NULL,
    "dose" DECIMAL(65,30) NOT NULL,
    "dose_unit" VARCHAR(20),
    "scheduled_at" TIMESTAMP(3),
    "logged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) NOT NULL DEFAULT 'taken',
    "administration_site" VARCHAR(50),
    "notes" TEXT,
    "photo_url" VARCHAR(500),

    CONSTRAINT "doses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "side_effects" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "dose_id" UUID,
    "substance_id" UUID,
    "symptom" VARCHAR(100) NOT NULL,
    "severity" INTEGER NOT NULL,
    "duration_hours" DECIMAL(65,30),
    "notes" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "side_effects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress_entries" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "data" JSONB,
    "file_urls" TEXT[],
    "notes" TEXT,
    "shared_with_clinic" BOOLEAN NOT NULL DEFAULT false,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "progress_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255),
    "message" TEXT,
    "scheduled_for" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "dismissed_at" TIMESTAMP(3),
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_insights" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "actions" JSONB,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "context_data" JSONB,
    "expires_at" TIMESTAMP(3),
    "dismissed_at" TIMESTAMP(3),
    "acted_on_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_annotations" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID NOT NULL,
    "annotation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_annotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_reports" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "content" TEXT NOT NULL,
    "sections" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content" (
    "id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "content_url" VARCHAR(500),
    "content_body" TEXT,
    "thumbnail_url" VARCHAR(500),
    "tags" TEXT[],
    "category_ids" UUID[],
    "substance_ids" UUID[],
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "tenant_ids" UUID[],
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "user_id" UUID,
    "patient_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "table_name" VARCHAR(100),
    "record_id" UUID,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clinic_invitations_invite_code_key" ON "clinic_invitations"("invite_code");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_invitations" ADD CONSTRAINT "clinic_invitations_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "substances" ADD CONSTRAINT "substances_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "substance_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_templates" ADD CONSTRAINT "protocol_templates_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "substance_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_templates" ADD CONSTRAINT "protocol_templates_substance_id_fkey" FOREIGN KEY ("substance_id") REFERENCES "substances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_templates" ADD CONSTRAINT "protocol_templates_created_by_clinic_id_fkey" FOREIGN KEY ("created_by_clinic_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocols" ADD CONSTRAINT "protocols_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocols" ADD CONSTRAINT "protocols_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "protocol_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocols" ADD CONSTRAINT "protocols_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocols" ADD CONSTRAINT "protocols_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocols" ADD CONSTRAINT "protocols_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_substances" ADD CONSTRAINT "protocol_substances_protocol_id_fkey" FOREIGN KEY ("protocol_id") REFERENCES "protocols"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "protocol_substances" ADD CONSTRAINT "protocol_substances_substance_id_fkey" FOREIGN KEY ("substance_id") REFERENCES "substances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doses" ADD CONSTRAINT "doses_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doses" ADD CONSTRAINT "doses_protocol_substance_id_fkey" FOREIGN KEY ("protocol_substance_id") REFERENCES "protocol_substances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doses" ADD CONSTRAINT "doses_substance_id_fkey" FOREIGN KEY ("substance_id") REFERENCES "substances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "side_effects" ADD CONSTRAINT "side_effects_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "side_effects" ADD CONSTRAINT "side_effects_dose_id_fkey" FOREIGN KEY ("dose_id") REFERENCES "doses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "side_effects" ADD CONSTRAINT "side_effects_substance_id_fkey" FOREIGN KEY ("substance_id") REFERENCES "substances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_entries" ADD CONSTRAINT "progress_entries_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_annotations" ADD CONSTRAINT "ai_annotations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_reports" ADD CONSTRAINT "ai_reports_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
