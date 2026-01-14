-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "stripe_subscription_id" VARCHAR(255),
ADD COLUMN     "subscription_period_end" TIMESTAMP(3),
ADD COLUMN     "subscription_price_id" VARCHAR(255),
ADD COLUMN     "trial_ends_at" TIMESTAMP(3);
