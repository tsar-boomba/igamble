/*
  Warnings:

  - Changed the type of `theme` on the `Preferences` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('DARK', 'LIGHT');

-- AlterTable
ALTER TABLE "Preferences" DROP COLUMN "theme",
ADD COLUMN     "theme" "Theme" NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET DATA TYPE TEXT;
