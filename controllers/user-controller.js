const User = require("../models/user");
const Product = require("../models/product");
const Catagory = require("../models/catagory");
const Subcatagory = require("../models/subcatagory");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.index = (req, res)=>{
    if(req.session.isAdmin){
        res.render('adminindex', {
            isSignedin: req.session.isSignedin,
            name: req.session.name,
            email: req.session.email,
            phone: req.session.phone,
            isAdmin: req.session.isAdmin,
            active: 'home',
            canManageProduct: req.session.canManageProduct,
            canManageUser: req.session.canManageUser,
            canManageOrder: req.session.canManageOrder
        });
    }
    else{
        Product.getAll(products=>{
            res.render('index', {
                isSignedin: req.session.isSignedin,
                name: req.session.name,
                email: req.session.email,
                phone: req.session.phone,
                isAdmin: req.session.isAdmin,
                products: products,
                active: 'home',
                title: 'All Products'
            });
        });
    }
}

exports.getProducts = (req, res)=>{
    Product.getAll(products=>{
        res.render('index', {
            isSignedin: req.session.isSignedin,
            name: req.session.name,
            email: req.session.email,
            phone: req.session.phone,
            isAdmin: req.session.isAdmin,
            products: products,
            active: 'home',
            title: 'All Products'
        });
    });
}

exports.getCatagories = (req, res)=>{
    Catagory.getAll(allcatagories=>{
        Subcatagory.getAll(allsubcatagories=>{
            res.render('catagories',{
                isSignedin: req.session.isSignedin,
                name: req.session.name,
                email: req.session.email,
                phone: req.session.phone,
                isAdmin: req.session.isAdmin,
                active: 'catagories',
                allcatagories: allcatagories,
                allsubcatagories: allsubcatagories
            });
        });
    });
}

exports.getProductWithId = (req, res)=>{
    var msg = "";
    if(req.query.msg){
        msg = req.query.msg;
    }
    Product.getAll(allproducts=>{
        Product.getProductWithId(req.params.product_id, product=>{
            if(product){
                res.render('product', {
                    isSignedin: req.session.isSignedin,
                    name: req.session.name,
                    email: req.session.email,
                    phone: req.session.phone,
                    isAdmin: req.session.isAdmin,
                    product: product,
                    threeproducts: allproducts,
                    active: '',
                    msg: msg
                });
            }else{
                res.render('404');
            }
        });
    });
}

exports.getSubcatagoryById = (req, res)=>{
    Subcatagory.getSubcatagoryById(req.params.subcatagory_id, onesubcatagory=>{
        var productsofsub = [];
        if(onesubcatagory){
            Product.getAll(products=>{
                products.forEach(element => {
                    if(JSON.stringify(element.subcatagory._id) == JSON.stringify(onesubcatagory._id)){
                        productsofsub.push(element);
                    }
                });
                res.render('index', {
                    isSignedin: req.session.isSignedin,
                    name: req.session.name,
                    email: req.session.email,
                    phone: req.session.phone,
                    isAdmin: req.session.isAdmin,
                    products: productsofsub,
                    active: 'catagories',
                    title: onesubcatagory.name,
                    subcatagory: onesubcatagory
                });
            });
        }else{
            res.render('404');
        }
    });
}

exports.getCart = (req, res)=>{
    if(req.session.isSignedin){
        var msg = '';
        if(req.query.msg){
            msg = req.query.msg;
        }
        User.getUserByPhone(req.session.phone, user=>{
            Cart.getCartOfUser(user, usercart=>{
                res.render('cart', {
                    isSignedin: req.session.isSignedin,
                    name: req.session.name,
                    email: req.session.email,
                    phone: req.session.phone,
                    isAdmin: req.session.isAdmin,
                    active: 'cart',
                    cartItems: usercart.items,
                    address1: req.session.address1,
                    address2: req.session.address2,
                    msg: msg
                });
            });
        });
    }else{
        res.redirect('/signin');
    }
}

exports.postCart = (req, res)=>{
    if(req.session.isSignedin){
        User.getUserByPhone(req.session.phone, user=>{
            Product.getProductWithId(req.body.product_id, oneproduct=>{
                if(oneproduct.stock < req.body.quantity){
                    res.redirect('/product/' + req.body.product_id + '?msg=Product is out of stock!');
                }
                else{
                    var extraDetails = '';
                    if(oneproduct.sizes[0]){
                        extraDetails = extraDetails + 'Size: ' + req.body.size + '\n';
                    }
                    if(oneproduct.colors[0]){
                        extraDetails = extraDetails + 'Color: ' + oneproduct.colors[req.body.color] + '\n';
                    }
                    Cart.addToCart(user, oneproduct, extraDetails, req.body.quantity);
                    res.redirect('/cart');
                }
            });
        });
    }else{
        res.redirect('/signin');
    }
}

exports.postDeleteCartItem = (req, res)=>{
    User.getUserByPhone(req.session.phone, user=>{
        Cart.deleteCartItem(user, req.body.itemindex, ()=>{
            res.redirect('/cart');
        });
    });
}

exports.getOrder = (req, res)=>{
    if(req.session.isAdmin){
        res.redirect('/manageOrders');
    }
    else{
        if(req.session.isSignedin){
            Order.getOrdersByPhone(req.session.phone, orders=>{
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
            res.redirect('/signin');
        }
    }
}

exports.postOrder = (req, res)=>{
    if(req.session.isSignedin){
        if(req.body.address === 'none'){
            res.redirect('/cart?popup=true&msg=Select address!');
        }else{
            User.getUserByPhone(req.session.phone, user=>{
                Cart.getCartOfUser(user, singlecart=>{
                    Order.createOrder(req.session.phone, singlecart, req.body.address);
                    singlecart.items.forEach(item=>{
                        Product.minusStock(item.product, item.quantity);
                    });
                    res.redirect('/order');
                });
            });
        }   
    }else{
        res.redirect('/signin');
    }
}

exports.postRateOrder = (req, res)=>{
    if(req.session.isSignedin){
        Order.rateOrder(req.body.order_id, req.body.rate_value);
        res.redirect('/view-order/'+req.body.order_id);
    }else{
        res.redirect('/signin');
    }
}

exports.error404 = (req, res)=>{
    res.status(404).render('404', {
        isSignedin: req.session.isSignedin,
        name: req.session.name,
        email: req.session.email,
        phone: req.session.phone,
        isAdmin: req.session.isAdmin
    });
}