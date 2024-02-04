-- CreateTable
CREATE TABLE `Model` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `modelName` VARCHAR(191) NOT NULL,
    `brandName` VARCHAR(191) NOT NULL,
    `engineKwPower` INTEGER NOT NULL,
    `engineCcPower` INTEGER NOT NULL,
    `MaxKmhSpeed` INTEGER NOT NULL,
    `PetrolLitreTank` INTEGER NOT NULL,
    `TankLitre` INTEGER NULL,
    `WeightKg` INTEGER NOT NULL,
    `WorkingWidth` INTEGER NULL,
    `CopiesNumber` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
