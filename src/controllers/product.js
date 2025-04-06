    
    const userRepository = require('../repositories/userRepository');
    const productRepository = require('../repositories/productRepository');
    const cartRepository = require('../repositories/cartRepository');
    const orderRepository = require('../repositories/orderRepository');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    
    const register = async (req, res) => {
        const { email, password } = req.body;
        try {
            const userId = await userRepository.createUser(email, password);
            res.json({ message: 'Usuario registrado', userId });
        } catch (error) {
            res.status(400).json({ message: 'Error al registrar', error: error.message });
        }
    };
    
    const login = async (req, res) => {
        const { email, password } = req.body;
        const user = await userRepository.findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    };
    
    const getAllProducts = async (req, res) => {
        const products = await productRepository.getAllProducts();
        res.json(products);
    };
    
    const getProductById = async (req, res) => {
        const product = await productRepository.getProductById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    };
    
    const createProduct = async (req, res) => {
        const { nombre, cantidad, precio } = req.body;
        try {
            const productId = await productRepository.createProduct(nombre, cantidad, precio);
            res.json({ message: 'Producto creado', productId });
        } catch (error) {
            res.status(400).json({ message: 'Error al crear producto', error: error.message });
        }
    };
    
    const updateProduct = async (req, res) => {
        const { nombre, cantidad, precio } = req.body;
        try {
            await productRepository.updateProduct(req.params.id, nombre, cantidad, precio);
            res.json({ message: 'Producto actualizado' });
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar producto', error: error.message });
        }
    };
    
    const deleteProduct = async (req, res) => {
        try {
            await productRepository.deleteProduct(req.params.id);
            res.json({ message: 'Producto eliminado' });
        } catch (error) {
            res.status(400).json({ message: 'Error al eliminar producto', error: error.message });
        }
    };
    
    const getCart = async (req, res) => {
        const cart = await cartRepository.getCartByUserId(req.user.id);
        res.json(cart);
    };
    
    const addToCart = async (req, res) => {
        const { productId, cantidad } = req.body;
        try {
            await cartRepository.addToCart(req.user.id, productId, cantidad);
            res.json({ message: 'Producto agregado al carrito' });
        } catch (error) {
            res.status(400).json({ message: 'Error al agregar al carrito', error: error.message });
        }
    };
    
    const removeFromCart = async (req, res) => {
        try {
            await cartRepository.removeFromCart(req.params.id, req.user.id);
            res.json({ message: 'Producto eliminado del carrito' });
        } catch (error) {
            res.status(400).json({ message: 'Error al eliminar del carrito', error: error.message });
        }
    };
    
    const checkout = async (req, res) => {
        try {
            const orderId = await orderRepository.createOrder(req.user.id);
            res.json({ message: 'Compra realizada', orderId });
        } catch (error) {
            res.status(400).json({ message: 'Error al realizar la compra', error: error.message });
        }
    };
    
    const getOrders = async (req, res) => {
        const orders = await orderRepository.getOrdersByUserId(req.user.id);
        res.json(orders);
    };
    
    module.exports = {
        register,
        login,
        getAllProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        getCart,
        addToCart,
        removeFromCart,
        checkout,
        getOrders
    };
    