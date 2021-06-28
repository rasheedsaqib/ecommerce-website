const mongoooseModels = require('./mongoose-models');
const Product = require('./product');
const Subcatagorymodel = mongoooseModels.subcatagorymodel;

module.exports = class Subcatagory{
    static addSubcatagory(name, image, catagory, cb){
        const newsubcatagory = new Subcatagorymodel({name: name, image: image,catagory: catagory});
        newsubcatagory.save();
        cb('Sub catagory added successfully!');
    }

    static getAll(cb){
        Subcatagorymodel.find((err, subcatagories)=>{
            if(!err){
                cb(subcatagories);
            }else{
                cb([]);
            }
        });
    }

    static getSubcatagoryById(id, cb){
        Subcatagorymodel.findOne({_id: id}, (err, subcatagory)=>{
            if(!err){
                cb(subcatagory);
            }else{
                cb();
            }
        });
    }

    static deleteSubcatagory(id){
        Subcatagory.getSubcatagoryById(id, subcatagory=>{
            if(subcatagory){
                Subcatagorymodel.deleteOne({_id: id}, err=>{
                    if(err){
                        console.log(err);
                    }
                    Product.deleteProductsOfSubcatagory(subcatagory);
                });
            }
        });
    }

    static editSubcatagory(id, name, imageUrl, catagory){
        Subcatagorymodel.findOne({_id:id},(err, subcatagory)=>{
            if(subcatagory){
                if(!imageUrl){
                    imageUrl = subcatagory.image;
                }
                if(!catagory){
                    catagory = subcatagory.catagory;
                }
                Subcatagorymodel.updateOne({_id: id},{name: name, image: imageUrl, catagory: catagory}, err=>{
                    Subcatagorymodel.findOne({_id: id},(err, updatesubcatagory)=>{
                        Product.editProductsSubcatagory(catagory, updatesubcatagory);
                    });
                });
            }
        });
    }

    static editSubcatagorysCatagory(catagory, updatedCatagory){
        this.getAll(subcatagories=>{
            subcatagories.forEach(item=>{
                if(JSON.stringify(item.catagory) === JSON.stringify(catagory)){
                    this.editSubcatagory(item._id, item.name, item.image, updatedCatagory);
                }
            });
        });
    }

    static deleteSubcatagoryOfCatagory(catagory){
        this.getAll(subcatagories=>{
            subcatagories.forEach(item=>{
                if(JSON.stringify(item.catagory) === JSON.stringify(catagory)){
                    this.deleteSubcatagory(item);
                }
            });
        });
    }

}