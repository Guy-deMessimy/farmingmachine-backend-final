/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_serviceId_fkey`;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `serviceId`;

-- AlterTable
ALTER TABLE `Service` ADD COLUMN `categoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
