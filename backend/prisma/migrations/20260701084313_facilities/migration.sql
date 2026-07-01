-- CreateTable
CREATE TABLE "Facility" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "index" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "descriptionPart1" TEXT NOT NULL,
    "descriptionPart2" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageCloudinaryId" TEXT,
    "specs" JSONB NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Facility_slug_key" ON "Facility"("slug");

-- CreateIndex
CREATE INDEX "Facility_published_featured_idx" ON "Facility"("published", "featured");

-- CreateIndex
CREATE INDEX "Facility_published_sortOrder_idx" ON "Facility"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "Facility_category_idx" ON "Facility"("category");

-- CreateIndex
CREATE INDEX "Facility_slug_idx" ON "Facility"("slug");
