-- AlterTable
ALTER TABLE `File` MODIFY `fileUrl` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE INDEX `File_fileName_fileUrl_key_idx` ON `File`(`fileName`, `fileUrl`, `key`);

-- CreateIndex
CREATE INDEX `Post_title_content_idx` ON `Post`(`title`, `content`);
