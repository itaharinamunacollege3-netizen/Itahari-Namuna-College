-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "authors" JSONB NOT NULL,
    "authorAffiliation" TEXT,
    "volume" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "doi" TEXT,
    "keywords" JSONB NOT NULL DEFAULT '[]',
    "accentColor" TEXT NOT NULL DEFAULT '#045d30',
    "coverImage" TEXT,
    "coverImageCloudinaryId" TEXT,
    "pdfUrl" TEXT,
    "pdfCloudinaryId" TEXT,
    "sections" JSONB NOT NULL,
    "callout" JSONB,
    "citeSuggestion" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_slug_key" ON "JournalEntry"("slug");

-- CreateIndex
CREATE INDEX "JournalEntry_published_featured_idx" ON "JournalEntry"("published", "featured");

-- CreateIndex
CREATE INDEX "JournalEntry_published_isPopular_idx" ON "JournalEntry"("published", "isPopular");

-- CreateIndex
CREATE INDEX "JournalEntry_published_publishedAt_idx" ON "JournalEntry"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "JournalEntry_field_idx" ON "JournalEntry"("field");

-- CreateIndex
CREATE INDEX "JournalEntry_slug_idx" ON "JournalEntry"("slug");
