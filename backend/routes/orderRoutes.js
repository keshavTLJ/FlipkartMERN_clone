const express = require('express');
const orderController = require('../controllers/orderController');
const verifyAuth = require('../middlewares/verifyAuth');

const orderRouter = express.Router();

orderRouter.post('/create-checkout-session', verifyAuth, orderController.createCheckoutSession);

orderRouter.post('/verify-payment', verifyAuth, orderController.verifyPayment);

orderRouter.get('/orders', verifyAuth, orderController.getOrders);

orderRouter.get('/order', verifyAuth, orderController.getOrder);

module.exports = orderRouter;