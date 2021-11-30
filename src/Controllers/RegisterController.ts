import {Request,Response} from 'express';

export function getRegisterPage(req:Request,res:Response){
    res.render('register');
};
