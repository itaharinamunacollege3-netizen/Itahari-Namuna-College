/*
  Warnings:

  - You are about to drop the column `department` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Staff` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Faculty_department_isHOD_idx";

-- DropIndex
DROP INDEX "Staff_category_idx";

-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "department",
ADD COLUMN     "departmentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "StaffCategory";

-- CreateTable
CREATE TABLE "StaffCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyDepartment" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacultyDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffCategory_slug_key" ON "StaffCategory"("slug");

-- CreateIndex
CREATE INDEX "StaffCategory_slug_idx" ON "StaffCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyDepartment_slug_key" ON "FacultyDepartment"("slug");

-- CreateIndex
CREATE INDEX "FacultyDepartment_slug_idx" ON "FacultyDepartment"("slug");

-- CreateIndex
CREATE INDEX "Faculty_departmentId_isHOD_idx" ON "Faculty"("departmentId", "isHOD");

-- CreateIndex
CREATE INDEX "Staff_categoryId_idx" ON "Staff"("categoryId");

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "FacultyDepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "StaffCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
