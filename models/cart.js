const mongoooseModels = require('./mongoose-models');
const Cartmodel = mongoooseModels.cartmodel;
const User = require('./user');
const Product = require('./product');

module.exports = class Cart{
    static addToCart(user, product, extraDetail, quantity){
        Cartmodel.findOne({user: user}, (err, singlecart)=>{
            if(singlecart){
                const updatedItems = singlecart.items;
                updatedItems.push({product: product, extraDetail: extraDetail, quantity: quantity});
                Cartmodel.updateOne({_id: singlecart.id}, {items: updatedItems}, err=>{
                    if(err){
                        console.log(err);
                    }
                });
            }
            else{
                const newCart = new Cartmodel({user: user, items: [{product: product, extraDetail: extraDetail, quantity: quantity}]});
                newCart.save();
            }
        });
    }

    static getAll(cb){
        Cartmodel.find((err, carts)=>{
            if(!err){
                cb(carts);
            }else{
                cb([]);
            }
        });
    }

    static getCartOfUser(user, cb){
        Cartmodel.findOne({user: user}, (err, singlecart)=>{
            if(singlecart){
                cb(singlecart);
            }
            else{
                cb({user: user, items: []});
            }
        });
    }

    static deleteCartItem(user, index, cb){
        Cartmodel.findOne({user: user}, (err, singlecart)=>{
            if(singlecart){
                if(singlecart.items[index]){
                    const updatedItems = singlecart.items;
                    updatedItems.splice(index,1);
                    Cartmodel.updateOne({_id: singlecart.id}, {items: updatedItems}, err=>{
                        if(err){
                            console.log(err);
                        }
                        cb();
                    });
                }
            }
        });
    }

    static clearUserCart(user){
        Cartmodel.updateOne({user: user}, {items: []}, err=>{
            if(err){
                console.log(err);
            }
        })
    }

    static updateUserinfoinCart(phone, user){
        this.getAll(carts=>{
            carts.forEach(item=>{
                if(item.user.phone === phone){
                    Cartmodel.updateOne({_id: item._id}, {user: user}, err=>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
            });
        });
    }

}