const db = require('../config/db');

class OrderRepository {
    // Crear una orden a partir del carrito
    async createOrder(userId) {
        // Obtener los ítems del carrito
        const cartItems = await db.query(`
            SELECT c.producto_id, p.precio, c.cantidad 
            FROM carritos c 
            JOIN productos p ON c.producto_id = p.id 
            WHERE c.usuario_id = ?
        `, [userId]);

        if (cartItems[0].length === 0) throw new Error('Carrito vacío');

        // Calcular el total
        const total = cartItems[0].reduce((sum, item) => sum + item.precio * item.cantidad, 0);

        // Crear la orden
        const [orderResult] = await db.query('INSERT INTO ordenes (usuario_id, total) VALUES (?, ?)', [userId, total]);
        const orderId = orderResult.insertId;

        // Agregar detalles de la orden
        for (const item of cartItems[0]) {
            await db.query(`
                INSERT INTO ordenes_detalle (orden_id, producto_id, cantidad, precio_unitario) 
                VALUES (?, ?, ?, ?)
            `, [orderId, item.producto_id, item.cantidad, item.precio]);
        }

        // Vaciar el carrito
        await db.query('DELETE FROM carritos WHERE usuario_id = ?', [userId]);

        return orderId;
    }

    // Ver todas las órdenes de un usuario
    async getOrdersByUserId(userId) {
        const [orders] = await db.query('SELECT * FROM ordenes WHERE usuario_id = ?', [userId]);
        for (let order of orders) {
            const [details] = await db.query(`
                SELECT od.*, p.nombre 
                FROM ordenes_detalle od 
                JOIN productos p ON od.producto_id = p.id 
                WHERE od.orden_id = ?
            `, [order.id]);
            order.detalles = details;
        }
        return orders;
    }
}

module.exports = new OrderRepository();