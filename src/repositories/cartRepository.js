const db = require('../config/db');

class CartRepository {
    // Ver el carrito de un usuario
    async getCartByUserId(userId) {
        const [rows] = await db.query(`
            SELECT c.id, c.producto_id, p.nombre, p.precio, c.cantidad 
            FROM carritos c 
 INNER JOIN productos p 
            WHERE c.producto_id = p.id AND c.usuario_id = ?
        `, [userId]);
        return rows;
    }

    // Agregar un producto al carrito
    async addToCart(userId, productId, cantidad) {
        // Verificar si el producto ya está en el carrito
        const [existing] = await db.query('SELECT * FROM carritos WHERE usuario_id = ? AND producto_id = ?', [userId, productId]);
        if (existing.length > 0) {
            // Si ya existe, actualizar la cantidad
            await db.query('UPDATE carritos SET cantidad = cantidad + ? WHERE usuario_id = ? AND producto_id = ?', [cantidad, userId, productId]);
        } else {
            // Si no existe, insertar nuevo
            await db.query('INSERT INTO carritos (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)', [userId, productId, cantidad]);
        }
        // Actualizar el stock del producto
        await db.query('UPDATE productos SET cantidad = cantidad - ? WHERE id = ?', [cantidad, productId]);
    }

    // Quitar un producto del carrito
    async removeFromCart(cartId, userId) {
        const [cartItem] = await db.query('SELECT producto_id, cantidad FROM carritos WHERE id = ? AND usuario_id = ?', [cartId, userId]);
        if (!cartItem) throw new Error('Item no encontrado en el carrito');
        
        // Restaurar el stock del producto
        await db.query('UPDATE productos SET cantidad = cantidad + ? WHERE id = ?', [cartItem.cantidad, cartItem.producto_id]);
        // Eliminar del carrito
        await db.query('DELETE FROM carritos WHERE id = ? AND usuario_id = ?', [cartId, userId]);
    }
}

module.exports = new CartRepository();