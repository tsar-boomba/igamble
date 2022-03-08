-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_bannerId_fkey";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "bannerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
