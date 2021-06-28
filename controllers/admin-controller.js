const User = require("../models/user");
const Catagory = require('../models/catagory');
const Subcatagory = require("../models/subcatagory");
const Product = require("../models/product");
const Order = require("../models/order");

exports.getAddProduct = (req, res)=>{
    var catMsg = '';
    var subMsg = '';
    var prodMsg = '';
    var msgColor = '';
    var name = '';
    var price = '';
    var details = '';
    var subcatagoryname = '';
    var catagoryname = '';

    if(req.query.catMsg){
        catMsg = req.query.catMsg;
    }
    if(req.query.subMsg){
        subMsg = req.query.subMsg;
    }
    if(req.query.prodMsg){
        prodMsg = req.query.prodMsg;
    }
    if(req.query.msgColor){
        msgColor = req.query.msgColor;
    }
    if(req.query.prodName){
        name = req.query.prodName;
    }
    if(req.query.price){
        price = req.query.price;
    }
    if(req.query.details){
        details = req.query.details;
    }
    if(req.query.subname){
        subcatagoryname = req.query.subname;
    }
    if(req.query.catName){
        catagoryname = req.query.catName;
    }

    if(req.session.isAdmin && req.session.canManageProduct){
        Catagory.getAll(allCatagories=>{
            Subcatagory.getAll(allsubcatagories=>{
                res.render('addproduct',{
                    isSignedin: req.session.isSignedin,
                    name: req.session.name,
                    email: req.session.email,
                    phone: req.session.phone,
                    isAdmin: req.session.isAdmin,
                    productname: name,
                    price: price,
                    details: details,
                    subcatagoryname: subcatagoryname,
                    catagoryname: catagoryname,
                    catMsg: catMsg,
                    subMsg: subMsg,
                    prodMsg, prodMsg,
                    msgColor: msgColor,
                    allCatagories: allCatagories,
                    allsubcatagories: allsubcatagories,
                    active: 'home'
                });
            });
        });
    }
    else{
        res.render('404');
    }
}

exports.postAddProduct = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        if(!(req.body.productname) || !(req.file) || !(req.body.price) || !(req.body.details) || !(req.body.sale) || (req.body.subcatagory === 'none')){
            res.redirect('/addproduct?prodMsg=Enter all the fields!&msgColor=brown&prodname='+req.body.productname);
        }
        else{
            var colors = req.body.colors.split(',');
            var sizes = req.body.sizes.split(',');
            Subcatagory.getSubcatagoryById(req.body.subcatagory, subcatagory=>{
                Product.addProduct(req.body.productname, req.file.path, req.body.price, req.body.sale, colors, sizes, req.body.details, req.body.stock, subcatagory, response=>{
                    res.redirect('/addproduct?prodMsg=Product added successfully!&msgColor=green');
                });
            });
        }
    }
    else{
        res.render('404');
    }
}

exports.postAddSubCatagory = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        Catagory.getCatagoryById(req.body.catagory, catagory=>{
            if(!(req.body.subcatagoryname) || (req.body.catagory === 'none' || !(req.file))){
                res.redirect('/addproduct?subMsg=Enter all the fields!&msgColor=brown&subname='+req.body.subcatagoryname);
            }
            else{
                Subcatagory.addSubcatagory(req.body.subcatagoryname, req.file.path, catagory, response=>{
                    if(response === 'Sub catagory added successfully!'){
                        res.redirect('/addproduct?subMsg='+response+'&msgColor=green');
                    }else{
                        res.redirect('/addproduct?subMsg='+response+'&msgColor=brown&subname='+req.body.subcatagoryname);
                    }
                });
            }
        });
    }
    else{
        res.render('404');
    }
}

exports.postAddCatagory = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        if(!req.body.catagoryname){
            res.redirect('/addproduct?catMsg=Name cant be empty!&msgColor=brown');
        }
        else{
            Catagory.addCatagory(req.body.catagoryname, response=>{
                if(response === 'Catagory added successfull!'){
                    res.redirect('/addproduct?catMsg='+response+'&msgColor=green');
                }
                else{
                    res.redirect('/addproduct?catMsg='+response+'&msgColor=brown&catName='+req.body.catagoryname);
                }
            });
        }
    }
    else{
        res.render('404');
    }
}

exports.getEditProduct = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        Product.getProductWithId(req.params.product_id, product=>{
            var prodMsg = '';
            var msgColor = '';
            if(req.query.prodMsg){
                prodMsg = req.query.prodMsg;
            }
            if(req.query.msgColor){
                msgColor = req.query.msgColor;
            }
            Subcatagory.getAll(allsubcatagories=>{
                res.render('editProduct', {
                    isSignedin: req.session.isSignedin,
                    name: req.session.name,
                    email: req.session.email,
                    phone: req.session.phone,
                    isAdmin: req.session.isAdmin,
                    productname: product.name,
                    price: product.price,
                    details: product.details,
                    stock: product.stock,
                    colors: product.colors.join(','),
                    sizes: product.sizes.join(','),
                    sale: product.sale,
                    prodMsg, prodMsg,
                    msgColor: msgColor,
                    allsubcatagories: allsubcatagories,
                    active: 'home',
                    id: req.params.product_id
                });
            });
        });
    }
    else{
        res.render('404');
    }
}

exports.postEditProduct = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        if(!(req.body.productname) || !(req.body.price) || !(req.body.details) || !(req.body.sale)){
            res.redirect('/edit-product/'+req.body.id+'?prodMsg=Enter all the fields!&msgColor=brown&prodname='+req.body.productname);
        }
        else{
            Subcatagory.getSubcatagoryById(req.body.subcatagory, subcatagory=>{
                var filePath = '';
                var colors = req.body.colors.split(',');
                var sizes = req.body.sizes.split(',');
                if(req.file){
                    filePath = req.file.path;
                }
                Product.editProduct(req.body.id, req.body.productname, filePath, req.body.price, req.body.sale, colors, sizes, req.body.details, req.body.stock, subcatagory, (response)=>{
                    res.redirect('/edit-product/' + req.body.id + '?prodMsg=' + response + '&msgColor=green');
                });
            });
        }
    }
    else{
        res.render('404');
    }
}

exports.postDeleteProduct = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        Product.deleteProduct(req.body.product_id);
        res.redirect('/product');
    }else{
        res.render('404');
    }
}

exports.getEditSubcatagory = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        Subcatagory.getSubcatagoryById(req.params.subcatagory_id, subcatagory=>{
            Catagory.getAll(allCatagories=>{
                var subMsg = '';
                var msgColor = 'brown';
                if(req.query.subMsg){
                    subMsg = req.query.subMsg;
                }
                if(req.query.msgColor){
                    msgColor = req.query.msgColor;
                }
                res.render('editSubcatagory',{
                    active: 'home',
                    isSignedin: req.session.isSignedin,
                    name: req.session.name,
                    email: req.session.email,
                    phone: req.session.phone,
                    isAdmin: req.session.isAdmin,
                    subcatagory: subcatagory,
                    allCatagories: allCatagories,
                    subMsg: subMsg,
                    msgColor: msgColor
                });
            });
        });
    }else{
        res.render('404');
    }
}

exports.postEditSubcatagory = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        if(!req.body.subcatagoryname){
            res.redirect('/edit-subcatagory/' + req.body.id + '?subMsg=Enter name!');
        }else{
            Catagory.getCatagoryById(req.body.catagory, catagory=>{
                var filePath = '';
                if(req.file){
                    filePath = req.file.path;
                }
                Subcatagory.editSubcatagory(req.body.id, req.body.subcatagoryname, filePath, catagory);
                Product.editProductsSubcatagory();
                res.redirect('/edit-subcatagory/' + req.body.id + '?subMsg=Subcatagory edited successfully!&msgColor=green');
            });
        }
    }else{
        res.render('404');
    }
}

exports.postDeleteSubcatagory = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        Subcatagory.deleteSubcatagory(req.body.subcatagory_id);
        res.redirect('/catagories');
    }else{
        res.render('404');
    }
}

exports.getEditCatagory = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        Catagory.getCatagoryById(req.params.catagory_id, catagory=>{
        var catMsg = '';
        var msgColor = 'brown';
        if(req.query.catMsg){
            catMsg = req.query.catMsg;
        }
        if(req.query.msgColor){
             msgColor = req.query.msgColor;
        }
        res.render('editCatagory',{
            active: 'home',
            isSignedin: req.session.isSignedin,
            name: req.session.name,
            email: req.session.email,
            phone: req.session.phone,
            isAdmin: req.session.isAdmin,
            id: req.params.catagory_id,
            catagory: catagory,
            catMsg: catMsg,
            msgColor: msgColor
        });
    });
    }else{
        res.render('404');
    }
}

exports.postEditCatagory = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        if(!req.body.catagoryname){
            res.redirect('/edit-catagory/' + req.body.id + '?catMsg=Enter name!');
        }else{
            Catagory.editCatagory(req.body.id, req.body.catagoryname);
            res.redirect('/edit-catagory/' + req.body.id + '?catMsg=Catagory updated successfully!&msgColor=green');
        }
    }else{
        res.render('404');
    }
}

exports.postDeleteCatagory = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageProduct){
        Catagory.deleteCatagory(req.body.catagory_id);
        res.redirect('/catagories');
    }else{
        res.render('404');
    }
}

exports.getAddUser = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageUser){
        var msg = '';
        var msgColor = 'brown';
        if(req.query.msg){
            msg = req.query.msg;
        }
        if(req.query.msgColor){
            msgColor = req.query.msgColor;
        }
        res.render('getAddUser',{
            active: 'home',
            isSignedin: req.session.isSignedin,
            name: req.session.name,
            email: req.session.email,
            phone: req.session.phone,
            isAdmin: req.session.isAdmin,
            msg: msg,
            msgColor: msgColor
        });
    }else{
        res.render('404');
    }
}

exports.postAddUser = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageUser){
        var canManageProduct = false;
        var canManageUser = false;
        var canManageOrder = false;
        if(req.body.product){
            canManageProduct = true;
        }if(req.body.user){
            canManageUser = true;
        }if(req.body.order){
            canManageOrder = true;
        }
        User.registerAdmin(req.body.name, req.body.email, req.body.phone, req.body.password, canManageProduct, canManageUser, canManageOrder, response=>{
            if(response === 'Registration successful!'){
                res.redirect('/adduser?msg=Registration successful!&msgColor=green');
            }else{
                res.redirect('/adduser?msg=' + response + '!&msgColor=brown');
            }
        });
    }else{
        res.render('404');
    }
}

exports.getAllAdmins = (req, res)=>{
    if(req.session.isAdmin  && req.session.canManageUser){
        User.getAllAdmins(admins=>{
            res.render('allAdmins',{
                active: 'users',
                isSignedin: req.session.isSignedin,
                name: req.session.name,
                email: req.session.email,
                phone: req.session.phone,
                isAdmin: req.session.isAdmin,
                admins: admins
            });
        });
    }else{
        res.render('404');
    }
}

exports.postDeleteAdmin = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageUser){
        User.deleteAdmin(req.body.id);
        res.redirect('/allAdmins');
    }else{
        res.render('404');
    }
}

exports.getManageOrders = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageOrder){
        Order.getAllOrders(orders=>{
            res.render('orders',{
                isSignedin: req.session.isSignedin,
                name: req.session.name,
                email: req.session.email,
                phone: req.session.phone,
                isAdmin: req.session.isAdmin,
                active: 'orders',
                allorders: orders
            });
        });
    }else{
        res.render('404');
    }
}

exports.getViewOrder = (req, res)=>{
    if(req.session.isSignedin){
        Order.getOrderById(req.params.order_id, order=>{
            if(order){
                if(order.cart.user.phone === req.session.phone || req.session.isAdmin){
                    res.render('vieworder', {
                        isSignedin: req.session.isSignedin,
                        name: req.session.name,
                        email: req.session.email,
                        phone: req.session.phone,
                        isAdmin: req.session.isAdmin,
                        canManageOrder: req.session.canManageOrder,
                        active: 'orders',
                        order: order
                    });
                }else{
                    res.render('404');
                }
            }else{
                res.render('404');
            }
        });
    }else{
        res.redirect('/signin');
    }
}

exports.postViewOrder = (req, res)=>{
    if(req.session.isAdmin && req.session.canManageOrder){
        Order.updateStatus(req.body.id);
        res.redirect('/view-order/' + req.body.id);
    }else{
        res.render('404');
    }
}