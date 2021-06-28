const mongoooseModels = require('./mongoose-models');
const Usermodel = mongoooseModels.usermodel;
const sha256 = require('sha256');
const Cart = require('./cart');

module.exports = class User{
    constructor(name, email, phone, password){
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    register(cb){
        Usermodel.findOne({phone: this.phone}, (err, user)=>{
            if(user){
                cb('Mobile number already exists!');
            }
            else if(!user){
                Usermodel.findOne({email: this.email}, (err, user)=>{
                    if(user){
                        cb('Email already exists!');
                    }
                    else if(!user){
                        const newUser = new Usermodel({
                            name: this.name,
                            email: this.email,
                            phone: this.phone,
                            password: sha256(this.password),
                            verified: false,
                            accountType: 'User',
                            canManageProduct: false,
                            canManageUser: false,
                            canManageOrder: false,
                            address1: '',
                            address2: ''
                        });
                        newUser.save();
                        cb('Registration successful!');
                    }
                    else{
                        cb('Unknown error!');
                    }
                });
            }
            else{
                cb('Unknown error!');
            }
        });
    }

    static registerAdmin(name, email, phone, password, canManageProduct, canManageUser, canManageOrder, cb){
        Usermodel.findOne({phone: phone}, (err, user)=>{
            if(user){
                cb('Mobile number already exists!');
            }
            else if(!user){
                Usermodel.findOne({email: email}, (err, user)=>{
                    if(user){
                        cb('Email already exists!');
                    }
                    else if(!user){
                        const newUser = new Usermodel({
                            name: name,
                            email: email,
                            phone: phone,
                            password: sha256(password),
                            verified: true,
                            accountType: 'Admin',
                            canManageProduct: canManageProduct,
                            canManageUser: canManageUser,
                            canManageOrder: canManageOrder,
                            address1: '',
                            address2: ''
                        });
                        newUser.save();
                        cb('Registration successful!');
                    }
                    else{
                        cb('Unknown error!');
                    }
                });
            }
            else{
                cb('Unknown error!');
            }
        });
    }

    static deleteAdmin(id){
        Usermodel.findOne({_id: id},(err, admin)=>{
            if(admin){
                Usermodel.deleteOne({_id: id},err=>{
                    if(err){
                        console.log(err);
                    }
                });
            }
        });
    }

    static getAllAdmins(cb){
        Usermodel.find({accountType: 'Admin'}, (err, admins)=>{
            if(!err){
                cb(admins);
            }else{
                cb([]);
            }
        });
    }

    static signinUser(phone, password, cb){
        Usermodel.findOne({phone: phone}, (err, user)=>{
            if(!user){
                cb([false, 'Mobile number not registered']);
            }
            else if(user){
                if(!(user.password === sha256(password))){
                    cb([false, 'Incorrect password!']);
                }
                else if(!user.verified){
                    cb([false, 'User not verified!']);
                }
                else{
                    cb([true, user]);
                }
            }
            else{
                cb([false, 'Unknown error!']);
            }
        });
    }

    static isPhoneRegistered(phone, cb){
        Usermodel.findOne({phone: phone}, (err, user)=>{
            if(user){
                cb(true);
            }
            else{
                cb(false);
            }
        });
    }

    static verify(phone){
        Usermodel.updateOne({phone: phone}, {verified: true}, err=>{
            if(err){
                console.log(err);
            }
            this.getUserByPhone(phone, user=>{
                Cart.updateUserinfoinCart(phone, user);
            });
        });
    }

    static getUserByEmail(email, cb){
        Usermodel.findOne({email: email}, (err, user)=>{
            if(!err){
                cb(user);
            }else{
                cb({});
            }
        });
    }

    static getUserByPhone(phone, cb){
        Usermodel.findOne({phone: phone}, (err, user)=>{
            if(!err){
                cb(user);
            }else{
                cb({});
            }
        });
    }

    static changeUserPassword(phone, password){
        Usermodel.updateOne({phone: phone}, {password: sha256(password)}, err=>{
            if(err){
                console.log(err);
            }
            this.getUserByPhone(phone, user=>{
                Cart.updateUserinfoinCart(phone, user);
            });
        });
    }

    static updateUser(name, email, phone, address1, address2){
        Usermodel.updateOne({phone: phone}, {name: name, email: email, address1: address1, address2: address2}, err=>{
            if(err){
                console.log(err);
            }
            this.getUserByPhone(phone, user=>{
                Cart.updateUserinfoinCart(phone, user);
            });
        });
    }

}