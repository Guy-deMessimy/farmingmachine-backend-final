-- DropIndex
DROP INDEX `File_fileName_fileUrl_key_idx` ON `File`;

-- AlterTable
ALTER TABLE `File` MODIFY `fileUrl` VARCHAR(1024) NOT NULL;

-- CreateIndex
CREATE INDEX `File_fileName_key_idx` ON `File`(`fileName`, `key`);
