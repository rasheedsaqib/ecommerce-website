const mongoooseModels = require('./mongoose-models');
const User = require('../models/user');
const Verificationmodel = mongoooseModels.verificationmodel;
const domain = 'http://localhost:3000/';
const sha256 = require('sha256');
const random = require('../util/random');
const message = require('../util/message');

module.exports = class Password{

    static deletePreviousEnteries(phone){
        Verificationmodel.deleteMany({phone: phone}, err=>{
            console.log(err);
        });
    }

    static doesCodeExist(code, cb){
        Verificationmodel.findOne({code: sha256(code.toString())}, (err, result)=>{
            if(result){
                cb(true);
            }
            else{
                cb(false);
            }
        });
    }

    static passwordReset(phone, cb){
        this.deletePreviousEnteries(phone);
        User.isPhoneRegistered(phone, response=>{
            if(response){
                var code = random.randomInt(111111, 999999);
                const valid = Math.floor(Date.now()/1000) + 3600;
                const newVerification = new Verificationmodel({phone: phone, code: sha256(code.toString()), valid: valid});
                newVerification.save();
                console.log(code);
                message.send(phone, 'Your verification code for Al-Hadi Mart is: ' + code, (responseData, response)=>{
                    cb(true, 'Success');
                });
            }
            else{
                cb(false,'Mobile number not registered!');
            }
        });
    }

    static getCodePhone(code, cb){
        Verificationmodel.findOne({code: sha256(code)}, (err, result)=>{
            if(result){
                cb(result.phone);
            }
            else{
                cb('');
            }
        });
    }

    static userVerification(phone){
        this.deletePreviousEnteries(phone);
        var code = random.randomInt(111111, 999999);
        const valid = Math.floor(Date.now()/1000) + 3600;
        const newVerification = new Verificationmodel({phone: phone, code: sha256(code.toString()), valid: valid});
        newVerification.save();
        console.log(code);
        message.send(phone, 'Your verification code for Al-Hadi Mart is: ' + code, (responseData, response)=>{
            console.log(responseData);
        });
    }

    static verifyUser(code, cb){
        Verificationmodel.findOne({code: sha256(code.toString())}, (err, result)=>{
            if(result){
                if(result.valid < Math.floor(Date.now()/1000)){
                    cb("Code has expired!");
                }
                else{
                    User.verify(result.phone);
                    this.deletePreviousEnteries(result.phone);
                    cb('Verification successful!');
                }
            }else{
                cb("Invalid code!");
            }
        });
    }

    static canRenderResetPage(code, cb){
        Verificationmodel.findOne({code: sha256(code.toString())}, (err, result)=>{
            if(result){
                if(result.valid < Math.floor(Date.now()/1000)){
                    cb(false, "Code has expired!");
                }
                else{
                    cb(true, 'Verification successful!');
                }
            }else{
                cb(false, "Invalid code!");
            }
        });
    }

    static changeUserPassword(code, password, cb){
        Verificationmodel.findOne({code: sha256(code.toString())}, (err, result)=>{
            if(result){
                if(result.valid < Math.floor(Date.now()/1000)){
                    cb(false, "Code has expired!");
                }
                else{
                    User.changeUserPassword(result.phone, password);
                    this.deletePreviousEnteries(result.phone);
                    cb('Password was changed successful!');
                }
            }else{
                cb(false, "Invalid code!");
            }
        });
    };

}