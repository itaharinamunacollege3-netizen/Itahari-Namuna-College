-- DropIndex
DROP INDEX "Notice_published_publishedAt_idx";

-- AlterTable: add columns (publishedDate nullable first for backfill)
ALTER TABLE "Notice" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Notice" ADD COLUMN "publishedDate" TEXT;

-- Backfill publishedDate from publishedAt (Gregorian YYYY-MM-DD for existing rows)
UPDATE "Notice"
SET "publishedDate" = to_char("publishedAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD')
WHERE "publishedDate" IS NULL;

-- Backfill featured from legacy showInPopup flag
UPDATE "Notice"
SET "featured" = "showInPopup"
WHERE "showInPopup" = true;

ALTER TABLE "Notice" ALTER COLUMN "publishedDate" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Notice_published_publishedDate_idx" ON "Notice"("published", "publishedDate");

-- CreateIndex
CREATE INDEX "Notice_published_featured_idx" ON "Notice"("published", "featured");
