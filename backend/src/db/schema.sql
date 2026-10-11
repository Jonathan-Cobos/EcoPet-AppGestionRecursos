-- Esquema inicial EcoPet
-- Ejecutar una sola vez para crear la base de datos y sus tablas

CREATE DATABASE IF NOT EXISTS ecopet
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ecopet;

-- -----------------------------------------------------
-- Usuarios
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  tipo_vivienda VARCHAR(50),
  area_m2 DECIMAL(8,2),
  habitaciones INT,
  banos INT,
  habitantes INT,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Estándares de consumo (valor de referencia por usuario/vivienda)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS estandares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo_servicio ENUM('agua', 'luz') NOT NULL,
  valor_estandar DECIMAL(10,2) NOT NULL,
  unidad VARCHAR(10) NOT NULL, -- 'm3' o 'kWh'
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY uq_usuario_servicio (usuario_id, tipo_servicio)
);

-- -----------------------------------------------------
-- Registros de consumo (lo que el usuario digita periódicamente)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS registros_consumo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo_servicio ENUM('agua', 'luz') NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  periodo DATE NOT NULL, -- mes/ciclo al que corresponde el registro
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Estado de la mascota por servicio (se recalcula con cada registro)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS mascota_estado (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo_servicio ENUM('agua', 'luz') NOT NULL,
  estado ENUM('feliz', 'neutral', 'decaido') NOT NULL DEFAULT 'neutral',
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY uq_usuario_mascota (usuario_id, tipo_servicio)
);

-- -----------------------------------------------------
-- Cuestionario de hábitos y recomendación generada
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS cuestionario_respuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo_servicio ENUM('agua', 'luz') NOT NULL,
  respuestas JSON NOT NULL,
  recomendacion TEXT,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Alertas de posible fuga (consumo con aumento súbito)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS alertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo_servicio ENUM('agua', 'luz') NOT NULL,
  registro_id INT NOT NULL,
  mensaje VARCHAR(255) NOT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (registro_id) REFERENCES registros_consumo(id) ON DELETE CASCADE
);
