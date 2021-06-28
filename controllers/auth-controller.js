const User = require('../models/user');
const Verification = require('../models/verification');

exports.getSignup = (req, res)=>{
    var name = '';
    var email = '';
    var phone = '';
    if(req.query.name){
        name = req.query.name;
    }
    if(req.query.email){
        email = req.query.email;
    }
    if(req.query.phone){
        phone = req.query.phone;
    }
    if(req.query.msg){
        res.render('signup',{msg: req.query.msg, msgColor: req.query.msgColor, name: name, email: email, phone: phone})
    }
    else{
        res.render('signup',{msg: '', msgColor: 'brown', name: name, email: email, phone: phone});
    }
}

exports.postSignup = (req, res)=>{
    if(!req.body.name || !req.body.email || !req.body.phone || !req.body.password || !req.body.repPassword){
        res.redirect('/signup?msg=Enter all the fields!&msgColor=brown');
    }
    else if(req.body.password !== req.body.repPassword){
        res.redirect('/signup?msg=Passwords are not same!&msgColor=brown&name='+req.body.name+'&email='+req.body.email+'&phone='+req.body.phone);
    }
    else{
        const newUser = new User(req.body.name, req.body.email, '+92'+req.body.phone, req.body.password);
        const msg = newUser.register(msg=>{
            if(msg === 'Registration successful!'){
                Verification.userVerification('+92'+req.body.phone);
                res.render('verify',{action: '/verification'});
            }else{
                res.redirect('/signup?msg=' + msg + '!&msgColor=brown&name='+req.body.name+'&email='+req.body.email+'&phone='+req.body.phone);
            }
        });
    }
}

exports.getSignin = (req, res)=>{
    var phone = '';
    if(req.query.phone){
        phone = req.query.phone;
    }
    if(req.query.msg){
        res.render('signin',{msg: req.query.msg, msgColor: req.query.msgColor, phone: phone})
    }
    else{
        res.render('signin',{msg: '', msgColor: 'brown', phone: phone});
    }
}

exports.postSignin = (req, res)=>{
    User.signinUser('+92'+req.body.phone, req.body.password, response=>{
        if(response[0]){
            req.session.isSignedin = true;
            req.session.name = response[1].name;
            req.session.email = response[1].email;
            req.session.phone = response[1].phone;
            req.session.canManageProduct = response[1].canManageProduct;
            req.session.canManageUser = response[1].canManageUser;
            req.session.canManageOrder = response[1].canManageOrder;
            req.session.address1 = response[1].address1;
            req.session.address2 = response[1].address2;
            if(response[1].accountType === "Admin"){
                req.session.isAdmin = true;
            }
            else{
                req.session.isAdmin = false;
            }
            res.redirect('/');
        }
        else{
            res.redirect('/signin?msg=' + response[1] + '&msgColor=brown&phone='+req.body.phone);
        }
    });
}

exports.getForget = (req, res)=>{
    var phone = '';
    if(req.query.phone){
        phone = req.query.phone;
    }
    if(req.query.msg){
        res.render('forgot',{msg: req.query.msg, msgColor: req.query.msgColor, phone: phone})
    }
    else{
        res.render('forgot',{msg: '', msgColor: 'brown', phone: phone});
    }
}

exports.postForget = (req, res)=>{
    Verification.passwordReset('+92'+req.body.phone, (response, responseData)=>{
        if(response){
            res.render('verify', {action: '/resetPassword'});
        }
        else{
            res.redirect('/forget?msg='+responseData+'&msgColor=brown&email='+req.body.email);
        }
    });
}

exports.postVerification = (req, res)=>{
    if(!req.body.code){
        res.redirect('404');
    }
    else{
        Verification.verifyUser(req.body.code, (response)=>{
            if(response === "Verification successful!"){
                res.redirect('/signin?msg=Verification successful!&msgColor=green');
            }
            else{
                res.redirect('/signin?msg=' + response + '&msgColor=brown');
            }
        });
    }
}

exports.resetPassword = (req, res)=>{
    if(!req.body.code){
        res.redirect('/forget?msg=Invalid code!&msgColor=brown');
    }else{
        Verification.canRenderResetPage(req.body.code, (response, responseMsg)=>{
            if(response){
                if(req.query.msg){
                    res.render('newpass',{code: req.body.code, msg: req.query.msg, msgColor: req.query.msgColor});
                }
                else{
                    res.render('newpass',{code: req.body.code, msg: '', msgColor: 'brown'});
                }
            }else{
                res.redirect('/forget?msg=' + responseMsg + '&msgColor=brown');
            }
        });
    }
}

exports.createNewPassword = (req, res)=>{
    if(!req.body.code){
        res.redirect('/forget?msg=Invalid code!&msgColor=brown');
    }
    else{
        if(req.body.password !== req.body.repPassword){
            res.redirect('/resetPassword?msg="Passwords are not same!&msgColor=brown&selector='+req.body.selector+'&token='+req.body.token)
        }
        else{
            Verification.changeUserPassword(req.body.code, req.body.password, response=>{
                if(response === 'Password was changed successful!'){
                    res.redirect('/forget?msg='+ response +'!&msgColor=green');
                }
                else{
                    res.redirect('/forget?msg='+ response +'!&msgColor=brown');
                }
            });
        }
    }
}

exports.getSendVerificationCode = (req, res)=>{
    if(req.query.phone){
        Verification.userVerification('+92' + req.query.phone);
        res.render('verify',{action: '/verification'});
    }
    else{
        res.redirect('/signin');
    }
}

exports.getSignout = (req, res)=>{
    req.session.destroy(err=>{
        console.log(err);
        res.redirect('/');
    });
}

exports.getProfile = (req, res)=>{
    if(req.session.isSignedin){
        var msg = '';
        var msgColor = '';
        if(req.query.msg){
            msg = req.query.msg;
            msgColor = req.query.msgColor;
        }
        res.render('profile',{isSignedin: true, name: req.session.name, email: req.session.email, phone: req.session.phone, address1: req.session.address1, address2: req.session.address2, isAdmin: req.session.isAdmin, msg: msg, msgColor: msgColor, active: 'profile'});
    }
    else{
        res.redirect('/signin');
    }
}

exports.postProfile = (req,res)=>{
    if(req.session.isSignedin){
        if(req.body.phone !== req.session.phone){
            res.redirect("/profile?msg=Email can't be changed&msgColor=brown");
        }
        else{
            User.updateUser(req.body.name, req.body.email, req.body.phone, req.body.address1, req.body.address2);
            req.session.isSignedin = true;
            req.session.name = req.body.name;
            req.session.email = req.body.email;
            req.session.phone = req.body.phone;
            req.session.address1 = req.body.address1;
            req.session.address2 = req.body.address2;
            res.redirect('/profile?msg=Profile was updated successfully!&msgColor=green');
        }
    }
    else{
        res.redirect('/signin');
    }
}