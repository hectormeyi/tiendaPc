CREATE DATABASE tiendaPc;
USE tiendaPc;
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL
);
INSERT INTO productos (nombre, cantidad, precio) VALUES
('Audífonos Gamer RGB', 3, 29.99),
('Mouse Óptico 3200 DPI', 3, 19.99),
('Teclado Mecánico RGB', 3, 59.99),
('Pad Mouse XL', 3, 12.99),
('Webcam 1080p', 3, 34.99),
('Micrófono USB', 3, 24.99),
('Adaptador USB-C', 3, 9.99),
('Cable HDMI 2m', 3, 14.99),
('Hub USB 4 puertos', 3, 17.99),
('Ventilador RGB PC', 3, 22.99);

USE tiendaPc;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de carritos
CREATE TABLE carritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de órdenes
CREATE TABLE ordenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de detalles de órdenes (relación productos-órdenes)
CREATE TABLE ordenes_detalle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

