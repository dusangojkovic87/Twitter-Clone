import {Request,Response} from 'express';
import User from '../Models/User';
import validator from 'validator';
import bcrypt from 'bcrypt';
import session from 'express-session';

export function getLoginPage(req:Request,res:Response){
    res.render('login');
};

export async function postLogin(req:Request,res:Response){
    const {email,password} = req.body;
    if(validator.isEmpty(email) || validator.isEmpty(password)){
        res.render('login',{errorMessage:'fields cannot be empty!'});
        return;
    }

    if(!validator.isEmail(email)){
        res.render('login',{errorMessage:'Email is not valid!'});
        return;
    }

    let user = await User.findOne({email:email});

    if(user == null || user == undefined){
        res.render('login',{errorMessage:'User does not exists!'});
        return;
    }

     let isMatch = await bcrypt.compare(password,user.password);
     if(isMatch){
         req.session.isAuth = true;
         res.redirect('/');
         return;
     }else{
         req.session.isAuth = false;
         res.render('login',{errorMessage:'Wrong password!'});
         return;
     }
    
}
