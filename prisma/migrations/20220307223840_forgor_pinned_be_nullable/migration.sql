-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pinnedPostId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "pinnedPostId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pinnedPostId_fkey" FOREIGN KEY ("pinnedPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
