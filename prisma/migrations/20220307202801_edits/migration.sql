/*
  Warnings:

  - You are about to drop the column `data` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `pictureUrl` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `bannerId` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "data";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "thumbnailUrl" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "pictureUrl",
ADD COLUMN     "bannerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PostEdit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "description" TEXT,
    "content" TEXT,
    "published" BOOLEAN,
    "thumbnailId" TEXT,
    "tags" TEXT[],
    "editedBy" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostEdit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageEdit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT,
    "editedBy" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,

    CONSTRAINT "ImageEdit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentEdit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "description" TEXT,
    "content" TEXT,
    "published" BOOLEAN,
    "thumbnailId" TEXT,
    "tags" TEXT[],
    "editedBy" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "CommentEdit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileEdit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bio" TEXT,
    "pictureId" TEXT,
    "bannerId" TEXT,
    "editedBy" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "ProfileEdit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionsEdit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admin" BOOLEAN,
    "moderator" BOOLEAN,
    "post" BOOLEAN,
    "comment" BOOLEAN,
    "editedBy" TEXT NOT NULL,
    "permissionsId" TEXT NOT NULL,

    CONSTRAINT "PermissionsEdit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagEdit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "color" TEXT,
    "editedBy" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,

    CONSTRAINT "TagEdit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostEdit" ADD CONSTRAINT "PostEdit_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostEdit" ADD CONSTRAINT "PostEdit_editedBy_fkey" FOREIGN KEY ("editedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageEdit" ADD CONSTRAINT "ImageEdit_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageEdit" ADD CONSTRAINT "ImageEdit_editedBy_fkey" FOREIGN KEY ("editedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentEdit" ADD CONSTRAINT "CommentEdit_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentEdit" ADD CONSTRAINT "CommentEdit_editedBy_fkey" FOREIGN KEY ("editedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileEdit" ADD CONSTRAINT "ProfileEdit_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileEdit" ADD CONSTRAINT "ProfileEdit_editedBy_fkey" FOREIGN KEY ("editedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionsEdit" ADD CONSTRAINT "PermissionsEdit_permissionsId_fkey" FOREIGN KEY ("permissionsId") REFERENCES "Permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionsEdit" ADD CONSTRAINT "PermissionsEdit_editedBy_fkey" FOREIGN KEY ("editedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagEdit" ADD CONSTRAINT "TagEdit_editedBy_fkey" FOREIGN KEY ("editedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagEdit" ADD CONSTRAINT "TagEdit_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "Tag"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
