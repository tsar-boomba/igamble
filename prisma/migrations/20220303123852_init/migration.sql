-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "moderator" BOOLEAN NOT NULL DEFAULT false,
    "comment" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_userId_key" ON "Permissions"("userId");

-- AddForeignKey
ALTER TABLE "Permissions" ADD CONSTRAINT "Permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
