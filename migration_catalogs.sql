-- CreateTable
CREATE TABLE IF NOT EXISTS `TipoDispositivo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TipoDispositivo_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE IF NOT EXISTS `Marca` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Marca_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert initial data for TipoDispositivo
INSERT IGNORE INTO `TipoDispositivo` (`nombre`, `activo`) VALUES
('Laptop', true),
('Desktop', true),
('All in One', true),
('Tablet', true),
('Smartphone', true),
('Impresora', true),
('Monitor', true),
('Otro', true);

-- Insert initial data for Marca
INSERT IGNORE INTO `Marca` (`nombre`, `activo`) VALUES
('HP', true),
('Dell', true),
('Lenovo', true),
('Acer', true),
('Asus', true),
('Apple', true),
('Samsung', true),
('Huawei', true),
('Xiaomi', true),
('Otra', true);
