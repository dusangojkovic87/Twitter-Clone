import {Request,Response} from 'express';

export = (req:Request,res:Response)=>{
    res.render('home');
}