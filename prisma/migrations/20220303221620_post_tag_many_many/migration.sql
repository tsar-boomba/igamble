/*
  Warnings:

  - You are about to drop the `_PostToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_B_fkey";

-- DropTable
DROP TABLE "_PostToTag";

-- CreateTable
CREATE TABLE "PostsToTags" (
    "postId" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "PostsToTags_pkey" PRIMARY KEY ("postId","tagName")
);

-- AddForeignKey
ALTER TABLE "PostsToTags" ADD CONSTRAINT "PostsToTags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsToTags" ADD CONSTRAINT "PostsToTags_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "Tag"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
