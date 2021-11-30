import {Request,Response} from 'express';

export function getLoginPage(req:Request,res:Response){
    res.render('login');
};

export function postLogin(req:Request,res:Response){
    console.log(req.body);
    res.redirect('/');
    
}
