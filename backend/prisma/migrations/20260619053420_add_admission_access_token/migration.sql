-- AlterTable: add nullable column first for backfill
ALTER TABLE "AdmissionApplication" ADD COLUMN "accessTokenHash" TEXT;

-- Legacy rows cannot be accessed without a token; assign unusable placeholder hashes
UPDATE "AdmissionApplication"
SET "accessTokenHash" = md5(random()::text || clock_timestamp()::text || id::text)
WHERE "accessTokenHash" IS NULL;

ALTER TABLE "AdmissionApplication" ALTER COLUMN "accessTokenHash" SET NOT NULL;

-- CreateIndex
CREATE INDEX "AdmissionApplication_email_idx" ON "AdmissionApplication"("email");
