const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller');

router.route('/addproduct')
.get(adminController.getAddProduct)
.post(adminController.postAddProduct);

router.route('/addsubcatagory')
.post(adminController.postAddSubCatagory);

router.route('/addcatagory')
.post(adminController.postAddCatagory);

router.route('/edit-product/:product_id')
.get(adminController.getEditProduct);

router.route('/edit-product')
.post(adminController.postEditProduct);

router.route('/delete-product')
.post(adminController.postDeleteProduct);

router.route('/edit-subcatagory/:subcatagory_id')
.get(adminController.getEditSubcatagory);

router.route('/edit-subcatagory')
.post(adminController.postEditSubcatagory);

router.route('/delete-subcatagory')
.post(adminController.postDeleteSubcatagory);

router.route('/edit-catagory/:catagory_id')
.get(adminController.getEditCatagory);

router.route('/edit-catagory')
.post(adminController.postEditCatagory);

router.route('/delete-catagory')
.post(adminController.postDeleteCatagory);

router.route('/adduser')
.get(adminController.getAddUser)
.post(adminController.postAddUser);

router.route('/allAdmins')
.get(adminController.getAllAdmins);

router.route('/deleteAdmin')
.post(adminController.postDeleteAdmin);

router.route('/manageOrders')
.get(adminController.getManageOrders);

router.route('/view-order/:order_id')
.get(adminController.getViewOrder);

router.route('/view-order')
.post(adminController.postViewOrder);

module.exports = router;