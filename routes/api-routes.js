const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api-controller');


// auth routes

router.route('/is-phone-registered')
.get(apiController.isPhoneRegstered);

router.route('/signin-user')
.post(apiController.postSignin);

router.route('/register')
.post(apiController.register);

router.route('/verify-user')
.post(apiController.verifyUser);

router.route('/forgot-password')
.post(apiController.forgotPassword);

router.route('/verify-forget-password')
.post(apiController.verifyForgetPassword);

router.route('/update-password')
.post(apiController.updatePassword);

// user routes

router.route('/products')
.get(apiController.getAllProducts);

router.route('/catagories')
.get(apiController.getAllCatagories);

router.route('/subcatagories')
.get(apiController.getAllSubcatagories);

router.route('/product/:product_id')
.get(apiController.getOneProduct);

router.route('/cart')
.get(apiController.getCart)
.post(apiController.postCart);

router.route('/delete-cart-item')
.post(apiController.deleteFromCart);

router.route('/order')
.get(apiController.getOrders)
.post(apiController.postOrder);

router.route('/order/:order_id')
.get(apiController.getorderById);

router.route('/rate-order')
.post(apiController.rateOrder);

router.route('/disclaimer')
.get(apiController.disclaimer);

router.route('/privacy-policy')
.get(apiController.privacy);

router.route('/contact-us')
.post(apiController.contactUs);

module.exports = router;