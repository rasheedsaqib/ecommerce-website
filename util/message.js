const Nexmo = require('nexmo');
const { response } = require('express');

const nexmo = new Nexmo({
    apiKey: 'b579ef14',
    apiSecret: 'X00fkXzRxxP5Scer'
  },{debug: true});

exports.send = (to, message, cb)=>{
    nexmo.message.sendSms('Al-Hadi', to, message, (err, response)=>{
        if(err){
            cb(err, false);
        }else{
            cb(response, true);
        }
    });
}