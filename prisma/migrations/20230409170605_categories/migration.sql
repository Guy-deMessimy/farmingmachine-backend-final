/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[categoriesId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoriesId` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Service` DROP FOREIGN KEY `Service_categoryId_fkey`;

-- AlterTable
ALTER TABLE `Service` DROP COLUMN `categoryId`,
    ADD COLUMN `categoriesId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Category`;

-- CreateTable
CREATE TABLE `Categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Service_categoriesId_key` ON `Service`(`categoriesId`);

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_categoriesId_fkey` FOREIGN KEY (`categoriesId`) REFERENCES `Categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
