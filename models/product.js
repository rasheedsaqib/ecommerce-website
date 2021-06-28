const mongoooseModels = require('./mongoose-models');
const Productmodel = mongoooseModels.productmodel;

module.exports = class Product{
    static addProduct(name, imageUrl, price, sale, colors, sizes, details, stock, subcatagory, cb){
        const newproduct = new Productmodel({name: name, image: imageUrl, price: price, sale: sale, rating: 0, colors: colors, sizes: sizes, details: details, stock: stock, totalItemsSold: 0, subcatagory: subcatagory});
        newproduct.save();
        cb('Product saved successfully');
    }

    static editProduct(id, name, imageUrl, price, sale, colors, sizes, details, stock, subcatagory, cb){
        Product.getProductWithId(id, product=>{
            if(product){
                if(!subcatagory){
                    subcatagory = product.subcatagory;
                }
                if(!imageUrl){
                    imageUrl = product.image;
                }
                Productmodel.updateOne({_id: id},{name: name, image: imageUrl, price: price, sale: parseInt(sale), colors: colors, sizes: sizes, details: details, stock: stock,subcatagory: subcatagory}, err=>{
                    if(err){
                        console.log(err);
                    }
                    cb('Product edited successfully!');
                });
            }else{
                cb('Invalid Product!');
            }
        });
    }

    static editProductsSubcatagory(subcatagory, updatesubcatagory){
        Productmodel.updateMany({subcatagory: subcatagory._id}, {subcatagory: updatesubcatagory._}, err=>{
            if(err){
                console.log(err);
            }
        });
    }

    static getAll(cb){
        Productmodel.find((err, products)=>{
            if(!err){
                cb(products);
            }else{
                cb([]);
            }
        });
    }

    static getProductWithId(id, cb){
        Productmodel.findById(id, (err, product)=>{
            if(!err){
                cb(product);
            }else{
                cb();
            }
        });
    }

    static getProductWithSubcatagory(subcatagory, cb){
        const to_return = [];
        this.getAll(products=>{
            products.forEach(element => {
                if(JSON.stringify(element) === JSON.stringify(subcatagory)){
                    console.log(element);
                }
            });
        });
        cb(to_return);
    }

    static deleteProduct(id){
        Product.getProductWithId(id, product=>{
            if(product){
                Productmodel.deleteOne({_id: id}, err=>{
                    if(err){
                        console.log(err);
                    }
                });
            }
        });
    }

    static minusStock(product, quantity){
        Productmodel.findOne({_id: product._id},(err, currentProduct)=>{
            Productmodel.updateOne({_id: currentProduct._id}, {stock: currentProduct.stock - quantity, totalItemsSold: currentProduct.totalItemsSold + quantity}, err=>{
                if(err){
                    console.log(err);
                }
            });
        });
    }

    static deleteProductsOfSubcatagory(subcatagory){
        this.getAll(products=>{
            products.forEach(item=>{
                if(JSON.stringify(item.subcatagory) === JSON.stringify(subcatagory)){
                    this.deleteProduct(item.id);
                }
            });
        });
    }

    static rateProduct(product, rating){
        Productmodel.findOne({_id: product._id}, (err, oneproduct)=>{
            if(oneproduct){
                var newrating = 0;
                if(oneproduct.rating === 0){
                    newrating = rating;
                }else{
                    newrating = (oneproduct.rating + parseInt(rating))/2;
                }
                Productmodel.updateOne({_id: product._id}, {rating: Math.floor(newrating)}, err=>{
                    if(err){
                        console.log(err);
                    }
                });
            }
        });
    }

}