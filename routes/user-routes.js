const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

router.route('/').
get(userController.index);

router.route('/catagories')
.get(userController.getCatagories);

router.route('/catagories/:subcatagory_id')
.get(userController.getSubcatagoryById);

router.route('/product')
.get(userController.getProducts);

router.route('/product/:product_id')
.get(userController.getProductWithId);

router.route('/cart')
.get(userController.getCart)
.post(userController.postCart);

router.route('/deletecartItem')
.post(userController.postDeleteCartItem);

router.route('/order')
.get(userController.getOrder)
.post(userController.postOrder);

router.route('/rate-order')
.post(userController.postRateOrder);

module.exports = router;