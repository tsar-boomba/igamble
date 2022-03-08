/*
  Warnings:

  - You are about to drop the column `color` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `TagEdit` table. All the data in the column will be lost.
  - Added the required column `background` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `font` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "color",
ADD COLUMN     "background" TEXT NOT NULL,
ADD COLUMN     "font" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TagEdit" DROP COLUMN "color",
ADD COLUMN     "background" TEXT,
ADD COLUMN     "font" TEXT;
