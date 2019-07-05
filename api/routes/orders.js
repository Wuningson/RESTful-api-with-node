const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

const OrdersControllers = require('../controllers/orders');

//handling incoming get requests to /orders
router.get('/', checkAuth, OrdersControllers.orders_get_all);

//handling incoming post requests to /orders
router.post('/', checkAuth, OrdersControllers.orders_create_orders);

//handling incoming get requests to /order/orderId
router.get('/:orderId', checkAuth, OrdersControllers.orders_get_order);

//handling incoming delete requests to /order/orderId
router.delete('/:orderId', checkAuth, OrdersControllers.orders_delete_one);

module.exports = router;