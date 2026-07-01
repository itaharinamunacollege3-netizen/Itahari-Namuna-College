-- CreateTable
CREATE TABLE "UnitCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "objectives" JSONB NOT NULL,
    "duties" JSONB NOT NULL,
    "actionPlan" JSONB NOT NULL,
    "iconUrl" TEXT,
    "iconCloudinaryId" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnitCategory_slug_key" ON "UnitCategory"("slug");

-- CreateIndex
CREATE INDEX "UnitCategory_slug_idx" ON "UnitCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_slug_key" ON "Unit"("slug");

-- CreateIndex
CREATE INDEX "Unit_published_featured_idx" ON "Unit"("published", "featured");

-- CreateIndex
CREATE INDEX "Unit_published_sortOrder_idx" ON "Unit"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "Unit_categoryId_idx" ON "Unit"("categoryId");

-- CreateIndex
CREATE INDEX "Unit_slug_idx" ON "Unit"("slug");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "UnitCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
