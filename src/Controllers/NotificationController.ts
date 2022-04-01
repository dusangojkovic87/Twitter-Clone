import {Request,Response} from 'express';
import Notification from '../Models/Notification';

export function getNotificationPage(req:Request,res:Response) {
    return res.render("notifications");
    
}

export async function getNotifications(req:Request,res:Response){
    let loggedUserId = req.session.userId;
    try {
        let notifications = await Notification.find({reciver:loggedUserId}).populate("sender");
        return res.status(200).json(notifications);
        
    } catch (err) {
        if(err){
            console.log(err);
        }
        
    }
   


}
