/*
  Warnings:

  - Added the required column `conception` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Model` ADD COLUMN `conception` VARCHAR(191) NOT NULL;
