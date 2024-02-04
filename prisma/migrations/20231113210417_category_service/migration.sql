/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Service` DROP FOREIGN KEY `Service_categoryId_fkey`;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN `serviceId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Service` DROP COLUMN `categoryId`;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
