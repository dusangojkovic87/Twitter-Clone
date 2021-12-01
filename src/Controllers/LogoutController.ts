import {Request,Response} from 'express';

export function logout(req:Request,res:Response){
    if(req.session){
        req.session.destroy((err) =>{
            if(err){
                throw err;
            }

            res.cookie('connect.sid', null, {
                expires: new Date('Thu, 01 Jan 1970 00:00:00 UTC'),
                httpOnly: true,
              });

              

           
             res.redirect('/login');
        });
    }
}
