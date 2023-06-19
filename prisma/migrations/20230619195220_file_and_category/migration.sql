/*
  Warnings:

  - You are about to drop the column `categoryId` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `File` DROP FOREIGN KEY `File_categoryId_fkey`;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN `fileId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `File` DROP COLUMN `categoryId`;

-- CreateIndex
CREATE UNIQUE INDEX `Category_fileId_key` ON `Category`(`fileId`);

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
