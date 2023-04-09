/*
  Warnings:

  - You are about to drop the column `categoriesId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[categoryId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Service` DROP FOREIGN KEY `Service_categoriesId_fkey`;

-- AlterTable
ALTER TABLE `Service` DROP COLUMN `categoriesId`,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Categories`;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Service_categoryId_key` ON `Service`(`categoryId`);

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
