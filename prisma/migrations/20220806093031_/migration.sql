/*
  Warnings:

  - A unique constraint covering the columns `[phonenumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_instagram_id_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "accountInstagram_id" TEXT,
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "thumbnail_url" TEXT,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phonenumber" INTEGER;

-- CreateTable
CREATE TABLE "Account" (
    "instagram_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_instagram_id_key" ON "Account"("instagram_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_phonenumber_key" ON "User"("phonenumber");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_accountInstagram_id_fkey" FOREIGN KEY ("accountInstagram_id") REFERENCES "Account"("instagram_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
