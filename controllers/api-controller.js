require('dotenv').config();

const User = require("../models/user");
const Verification = require("../models/verification");
const Product = require('../models/product');
const Catagory = require('../models/catagory');
const Subcatagory = require('../models/subcatagory');
const Cart = require("../models/cart");
const Order = require("../models/order");

// auth apis

exports.isPhoneRegstered = (req, res)=>{
    if(req.query.key === process.env.API_KEY && req.query.secret === process.env.API_SECRET && req.query.phone){
        User.isPhoneRegistered("+" + req.query.phone, response=>{
            res.send(JSON.stringify({
                success: true,
                isRegistered: response,
                msg: "Authentication Successful!"
            }));
        });
    }else{
        res.send(JSON.stringify({
            success: false,
            isRegistered: false,
            msg: "Authentication failed!"
        }));
    }
}

exports.postSignin = (req, res)=>{
    if(req.body.key === process.env.API_KEY && req.body.secret === process.env.API_SECRET && req.body.phone && req.body.password){

        User.signinUser(req.body.phone, req.body.password, (response)=>{
            if(response[0]){
                User.getUserByPhone(req.body.phone, user=>{
                    res.send(user);
                });
            }else{
                res.send(response[1]);
            }
        });

    }else{
        res.send("Authentication failed!");
    }
}

exports.register = (req, res)=>{
    if(req.body.key === process.env.API_KEY && req.body.secret === process.env.API_SECRET && req.body.name && req.body.email && req.body.phone && req.body.password){
        const newUser = new User(req.body.name, req.body.email, req.body.phone, req.body.password);
        const msg = newUser.register(msg=>{
            if(msg === 'Registration successful!'){
                Verification.userVerification(req.body.phone);
                res.send(msg);
            }else{
                res.send(msg);
            }
        });
    }else{
        res.send("Authentication failed!");
    }
}

exports.verifyUser = (req, res)=>{
    if(req.body.key === process.env.API_KEY && req.body.secret === process.env.API_SECRET && req.body.code){
        Verification.verifyUser(req.body.code, (response)=>{
            res.send(response);
        });
    }else{
        res.send("Authentication failed!");
    }
}

exports.forgotPassword = (req, res)=>{
    if(req.body.key === process.env.API_KEY && req.body.secret === process.env.API_SECRET && req.body.phone){
        Verification.passwordReset(req.body.phone, (response, responseData)=>{
            res.send(responseData);
        });
    }else{
        res.send("Authentication failed!");
    }
}

exports.verifyForgetPassword = (req, res)=>{
    if(req.body.key === process.env.API_KEY && req.body.secret === process.env.API_SECRET && req.body.code){
        Verification.canRenderResetPage(req.body.code, (response, responseMsg)=>{
            res.send(responseMsg);
        });
    }else{
        res.send("Authentication failed!");
    }
}

exports.updatePassword = (req, res)=>{
    if(req.body.key === process.env.API_KEY && req.body.secret === process.env.API_SECRET && req.body.code && req.body.password){
        Verification.changeUserPassword(req.body.code, req.body.password, response=>{
            res.send(response);
        });
    }else{
        res.send("Authentication failed!");
    }
}


// user apis

exports.getAllProducts = (req, res)=>{
    if(req.query.key === process.env.API_KEY && req.query.secret === process.env.API_SECRET){
        Product.getAll(products=>{
            res.send(products);
        });
    }else{
        res.send();
    }
}

exports.getAllSubcatagories = (req, res)=>{
    if(req.query.key === process.env.API_KEY && req.query.secret === process.env.API_SECRET){
        Subcatagory.getAll(subcatagories=>{
            res.send(subcatagories);
        });
    }else{
        res.send();
    }
}

exports.getAllCatagories = (req, res)=>{
    if(req.query.key === process.env.API_KEY && req.query.secret === process.env.API_SECRET){
        Catagory.getAll(catagories=>{
            res.send(catagories);
        });
    }else{
        res.send();
    }
}

exports.getOneProduct = (req, res)=>{
    if(req.query.key === process.env.API_KEY && req.query.secret === process.env.API_SECRET && req.params.product_id){
        Product.getProductWithId(req.params.product_id, product=>{
            res.send(product);
        });
    }else{
        res.send();
    }
}


exports.getCart = (req, res)=>{
    if(req.query.key === process.env.API_KEY && req.query.secret === process.env.API_SECRET){
        User.getUserByPhone("+" + req.query.phone, user=>{
            Cart.getCartOfUser(user, usercart=>{
                res.send(usercart);
            });
        });
    }else{
        res.send();
    }
}

exports.postCart = (req, res)=>{
    if(req.body.key === process.env.API_KEY && req.body.secret === process.env.API_SECRET){
        User.getUserByPhone(req.body.phone, user=>{
            Product.getProductWithId(req.body.product_id, oneproduct=>{
                if(oneproduct.stock < parseInt(req.body.quantity)){
                    res.send('Product is out of stock!');
                }
                else{
                    var extraDetails = req.body.extradetails;
                    Cart.addToCart(user, oneproduct, extraDetails, req.body.quantity);
                    res.send("Product added to cart!");
                }
            });
        });
    }else{
        res.send("Authentication failed!");
    }
}

exports.deleteFromCart = (req, res)=>{
    if(req.body.key === process.env.API_KEY && req.body.secret === process.env.API_SECRET){
        User.getUserByPhone(req.body.phone, user=>{
            Cart.deleteCartItem(user, req.body.itemindex, ()=>{
                res.send('success');
            });
        });
    }else{
        res.send("Auth error!");
    }
}

exports.getOrders = (req, res)=>{
    if(req.query.key === process.env.API_KEY && req.query.secret === process.env.API_SECRET){
        Order.getOrdersByPhone("+" + req.query.phone, orders=>{
            res.send(orders);
        });
    }else{
        res.send("Authentication failed!");
    }
}

exports.postOrder = (req, res)=>{
    if(req.body.key === process.env.API_KEY && req.body.secret === process.env.API_SECRET){
        User.getUserByPhone(req.body.phone, user=>{
            Cart.getCartOfUser(user, singlecart=>{
                Order.createOrder(req.body.phone, singlecart, req.body.address);
                singlecart.items.forEach(item=>{
                    Product.minusStock(item.product, item.quantity);
                });
                res.send('Success!');
            });
        });  
    }else{
        res.send("Authentication failed1");
    }
}

exports.getorderById = (req, res)=>{
    if(req.query.key === process.env.API_KEY && req.query.secret === process.env.API_SECRET){
        Order.getOrderById(req.params.order_id, order=>{
            if(order){
                res.send(order);
            }else{
                res.send();
            }
        });
    }else{
        res.send();
    }
}

exports.rateOrder = (req, res)=>{
    if(req.body.key === process.env.API_KEY && req.body.secret === process.env.API_SECRET){
        Order.rateOrder(req.body.order_id, req.body.rate_value);
        res.send("Order was rated successfully!");
    }else{
        res.send("Authentication failed1");
    }
}


exports.disclaimer = (req, res)=>{
    res.render('disclaimer');
}

exports.privacy = (req, res)=>{
    res.render('privacy-policy');
}

exports.contactUs = (req, res)=>{
    if(req.body.key === process.env.API_KEY && req.body.secret === process.env.API_SECRET){
        res.send(req.body.name + req.body.phone + req.body.message);
    }else{
        res.send("Authentication failed1");
    }
}