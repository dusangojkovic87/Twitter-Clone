import express,{Request,Response,NextFunction} from 'express';

export function isAuthenticated(req:Request,res:Response,next:NextFunction){
    if(req.session && req.session.isAuth === true){
        return next();
    }else{
        res.redirect("/login");
        return;
    }

}
