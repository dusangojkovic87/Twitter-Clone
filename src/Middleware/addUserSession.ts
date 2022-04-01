import express,{Request,Response,NextFunction} from 'express';
export function addUserSession(req:Request,res:Response,next:NextFunction){
    res.locals.user = req.session.user;
    res.locals.loggedUserId = req.session.userId;
    next();
}
