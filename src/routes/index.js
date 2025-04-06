const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const mainController = require('../controllers/product');

// Autenticación
router.post('/register', mainController.register);
router.post('/login', mainController.login);

// Productos
router.get('/products', mainController.getAllProducts);
router.get('/products/:id', mainController.getProductById);
router.post('/products', verificarToken, mainController.createProduct);
router.put('/products/:id', verificarToken, mainController.updateProduct);
router.delete('/products/:id', verificarToken, mainController.deleteProduct);

// Carrito
router.get('/cart', verificarToken, mainController.getCart);
router.post('/cart', verificarToken, mainController.addToCart);
router.delete('/cart/:id', verificarToken, mainController.removeFromCart);

// Órdenes
router.post('/checkout', verificarToken, mainController.checkout);
router.get('/orders', verificarToken, mainController.getOrders);

module.exports = router;
