const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.route('/signup')
.get(authController.getSignup)
.post(authController.postSignup);

router.route('/signin')
.get(authController.getSignin)
.post(authController.postSignin);

router.route('/forget')
.get(authController.getForget)
.post(authController.postForget);

router.route('/verification')
.post(authController.postVerification);

router.route('/sendVerificationCode')
.get(authController.getSendVerificationCode);

router.route('/resetPassword')
.post(authController.resetPassword);

router.route('/newPassword')
.post(authController.createNewPassword);

router.route('/signout')
.get(authController.getSignout);

router.route('/profile')
.get(authController.getProfile)
.post(authController.postProfile);

module.exports = router;