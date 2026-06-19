-- AlterTable
ALTER TABLE "GalleryAlbum" ADD COLUMN "coverImageCloudinaryId" TEXT;

-- AlterTable
ALTER TABLE "GalleryImage" ADD COLUMN "cloudinaryPublicId" TEXT;
