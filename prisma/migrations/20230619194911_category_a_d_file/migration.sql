/*
  Warnings:

  - A unique constraint covering the columns `[categoryId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `File` ADD COLUMN `categoryId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `File_categoryId_key` ON `File`(`categoryId`);

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
