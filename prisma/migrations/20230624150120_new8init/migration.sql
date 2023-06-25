-- DropForeignKey
ALTER TABLE `Category` DROP FOREIGN KEY `Category_fileId_fkey`;

-- AlterTable
ALTER TABLE `Category` MODIFY `fileId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
