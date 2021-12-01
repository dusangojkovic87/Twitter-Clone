import express,{Request,Response,NextFunction} from 'express';
import { request } from 'http';

export function isAuthenticated(req:Request,res:Response,next:NextFunction){
    if(req.session && req.session.isAuth === true){
        next();
        res.redirect('/');
        return;
    }else{
        res.redirect("/login");
        return;
    }

}
