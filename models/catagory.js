const mongoooseModels = require('./mongoose-models');
const Subcatagory = require('./subcatagory');
const Catagorymodel = mongoooseModels.catagorymodel;

module.exports = class Catagory{
    
    static addCatagory(name, cb){
        Catagorymodel.findOne({name: name}, (err, catagory)=>{
            if(!catagory){
                const newcatagory = new Catagorymodel({name: name});
                newcatagory.save();
                cb('Catagory added successfull!');
            }
            else{
                cb('Catagory already exists!');
            }
        });
    }

    static getAll(cb){
        Catagorymodel.find((err, catagories)=>{
            if(!err){
                cb(catagories);
            }
            else{
                cb([]);
            }
        });
    }

    static getCatagoryById(id, cb){
        Catagorymodel.findOne({_id: id}, (err, catagory)=>{
            cb(catagory);
        });
    }

    static editCatagory(id, name){
        Catagorymodel.findOne({_id: id},(err, catagory)=>{
            if(catagory){
                Catagorymodel.updateOne({_id: id},{name: name},err=>{
                    if(err){
                        console.log(err);
                    }
                    Catagorymodel.findOne({_id: id},(err, updatedCatagory)=>{
                        Subcatagory.editSubcatagorysCatagory(catagory, updatedCatagory);
                    });
                });
            }
        });
    }

    static deleteCatagory(id){
        Catagorymodel.findOne({_id: id}, (err, catagory)=>{
            if(catagory){
                Catagorymodel.deleteOne({_id: id}, err=>{
                    if(err){
                        console.log(err);
                    }
                    Subcatagory.deleteSubcatagoryOfCatagory(catagory);
                });
            }
        });
    }

}