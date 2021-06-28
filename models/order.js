const mongoooseModels = require('./mongoose-models');
const Cart = require('./cart');
const User = require('./user');
const Product = require('./product');
const Ordermodel = mongoooseModels.ordermodel;
const delievery = require('../util/delievery');

module.exports = class Order{
    static createOrder(phone, cart, address){
        var totalPrice = 0;
        cart.items.forEach(item => {
            totalPrice = totalPrice + ( (item.product.price - item.product.price*(item.product.sale/100)) * item.quantity);
        });
        const newOrder = new Ordermodel({phone: phone, cart: cart, address: address, totalPrice: totalPrice, delieveryCharges: Math.floor(delievery.calculateDelieveryCharges(totalPrice)), status: 'Placed'});
        newOrder.save();
        User.getUserByPhone(phone, oneuser=>{
            Cart.clearUserCart(oneuser);
        });
    }
    
    static getOrdersByPhone(phone, cb){
        Ordermodel.find({phone: phone}, (err, orders)=>{
            if(!err){
                cb(orders);
            }else{
                cb([]);
            }
        });
    }

    static getAllOrders(cb){
        Ordermodel.find((err, orders)=>{
            if(!err){
                cb(orders);
            }else{
                cb([]);
            }
        });
    }

    static updateStatus(id){
        Ordermodel.findOne({_id: id},(err, order)=>{
            if(order){
                var updateStatusText = '';
                if(order.status === 'Placed'){
                    updateStatusText = 'Packed'
                }
                if(order.status === 'Packed'){
                    updateStatusText = 'Being delievered'
                }
                if(order.status === 'Being delievered'){
                    updateStatusText = 'Delievered'
                }
                Ordermodel.updateOne({_id: id}, {status: updateStatusText}, err=>{
                    if(err){
                        console.log(err);
                    }
                });
            }
        });
    }

    static getOrderById(id, cb){
        Ordermodel.findOne({_id: id}, (err, order)=>{
            cb(order);
        });
    }

    static rateOrder(id, rating){
        this.getOrderById(id, oneorder=>{
            oneorder.cart.items.forEach(item=>{
                Product.rateProduct(item.product, rating);
            });
            Ordermodel.updateOne({_id: id}, {status: 'Rated'}, err=>{
                if(err){
                    console.log(err);
                }
            });
        });
    }

}