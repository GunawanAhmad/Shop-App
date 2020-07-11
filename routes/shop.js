const path = require('path');
const isAuth = require('../midProtect/isAuth')

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId',shopController.getProductbyId)

router.get('/cart',isAuth, shopController.getCart);

router.post('/cart',isAuth, shopController.postCart)

router.post('/cart-delete-item',isAuth, shopController.deleteCartItem)

router.post('/create-order',isAuth, shopController.postOrder)

router.get('/orders', shopController.getOrders);

router.get('/order/:orderId', isAuth, shopController.getInvoice)



module.exports = router;
