/*
  Warnings:

  - You are about to drop the `BoardMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CellUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentBlock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Facility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacilityImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HeroSlide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Leadership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SiteSetting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SiteStatistic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FacilityImage" DROP CONSTRAINT "FacilityImage_facilityId_fkey";

-- DropTable
DROP TABLE "BoardMember";

-- DropTable
DROP TABLE "CellUnit";

-- DropTable
DROP TABLE "ContentBlock";

-- DropTable
DROP TABLE "Facility";

-- DropTable
DROP TABLE "FacilityImage";

-- DropTable
DROP TABLE "HeroSlide";

-- DropTable
DROP TABLE "Leadership";

-- DropTable
DROP TABLE "SiteSetting";

-- DropTable
DROP TABLE "SiteStatistic";
