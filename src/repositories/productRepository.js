const db = require('../config/db');

class ProductRepository {
    async getAllProducts() {
        const [rows] = await db.query('SELECT * FROM productos');
        return rows;
    }

    async getProductById(id) {
        const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [id]);
        return rows[0];
    }

    async createProduct(nombre, cantidad, precio) {
        const [result] = await db.query('INSERT INTO productos (nombre, cantidad, precio) VALUES (?, ?, ?)', [nombre, cantidad, precio]);
        return result.insertId;
    }

    async updateProduct(id, nombre, cantidad, precio) {
        await db.query('UPDATE productos SET nombre = ?, cantidad = ?, precio = ? WHERE id = ?', [nombre, cantidad, precio, id]);
    }

    async deleteProduct(id) {
        await db.query('DELETE FROM productos WHERE id = ?', [id]);
    }
}

module.exports = new ProductRepository();