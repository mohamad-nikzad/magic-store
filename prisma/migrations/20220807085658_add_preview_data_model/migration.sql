/*
  Warnings:

  - You are about to drop the column `accountInstagram_id` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_accountInstagram_id_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "accountInstagram_id";

-- CreateTable
CREATE TABLE "previewProduct" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "accountInstagram_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "previewProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "previewProduct_id_key" ON "previewProduct"("id");

-- AddForeignKey
ALTER TABLE "previewProduct" ADD CONSTRAINT "previewProduct_accountInstagram_id_fkey" FOREIGN KEY ("accountInstagram_id") REFERENCES "Account"("instagram_id") ON DELETE SET NULL ON UPDATE CASCADE;
