-- =============================================
--  BASE DE DATOS: gestion_empleados
--  Ejecuta este script en phpMyAdmin o MySQL
-- =============================================

CREATE DATABASE IF NOT EXISTS gestion_empleados
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gestion_empleados;

-- -----------------------------------------------
-- Tabla de empleados
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS empleados (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    apellido    VARCHAR(100) NOT NULL,
    cargo       VARCHAR(100) NOT NULL,
    tipo        ENUM('tiempo_completo','medio_tiempo','contratista') NOT NULL DEFAULT 'tiempo_completo',
    salario_base DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    fecha_ingreso DATE NOT NULL,
    email       VARCHAR(150),
    telefono    VARCHAR(20),
    activo      TINYINT(1) NOT NULL DEFAULT 1,
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla de vacaciones
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS vacaciones (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id     INT NOT NULL,
    fecha_inicio    DATE NOT NULL,
    fecha_fin       DATE NOT NULL,
    dias            INT NOT NULL,
    estado          ENUM('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
    observacion     TEXT,
    creado_en       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Tabla de nómina / reportes de pago
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS nomina (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id     INT NOT NULL,
    periodo         VARCHAR(20) NOT NULL COMMENT 'Ej: 2024-01',
    salario_base    DECIMAL(12,2) NOT NULL,
    bonificaciones  DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    deducciones     DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    salario_neto    DECIMAL(12,2) NOT NULL,
    generado_en     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Datos de prueba
-- -----------------------------------------------
INSERT INTO empleados (nombre, apellido, cargo, tipo, salario_base, fecha_ingreso, email, telefono) VALUES
('Juan',    'Pérez',    'Desarrollador Backend',  'tiempo_completo', 3500000, '2022-01-15', 'juan.perez@empresa.com',    '3001234567'),
('María',   'González', 'Diseñadora UX',          'tiempo_completo', 3000000, '2021-06-01', 'maria.gonzalez@empresa.com','3109876543'),
('Carlos',  'Rodríguez','Analista de Datos',      'medio_tiempo',    1800000, '2023-03-10', 'carlos.rodriguez@empresa.com','3207654321'),
('Ana',     'Martínez', 'Gerente de Proyectos',   'tiempo_completo', 5000000, '2020-08-20', 'ana.martinez@empresa.com',  '3151112233'),
('Luis',    'Hernández','DevOps',                 'contratista',     4200000, '2023-11-01', 'luis.hernandez@empresa.com','3004445566');
