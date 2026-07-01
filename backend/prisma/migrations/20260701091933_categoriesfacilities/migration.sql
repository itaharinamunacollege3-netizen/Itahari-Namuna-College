/*
  Warnings:

  - You are about to drop the column `category` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionPart1` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `descriptionPart2` on the `Facility` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descriptions` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Facility_category_idx";

-- AlterTable
ALTER TABLE "Facility" DROP COLUMN "category",
DROP COLUMN "descriptionPart1",
DROP COLUMN "descriptionPart2",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "descriptions" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "FacilityCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacilityCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacilityCategory_slug_key" ON "FacilityCategory"("slug");

-- CreateIndex
CREATE INDEX "FacilityCategory_slug_idx" ON "FacilityCategory"("slug");

-- CreateIndex
CREATE INDEX "Facility_categoryId_idx" ON "Facility"("categoryId");

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FacilityCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
