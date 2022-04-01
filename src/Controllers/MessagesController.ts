import { Request, Response } from "express";
import User from "../Models/User";
import Message from "../Models/Message";
import getSocketIo from "../server";


export function getMessagesPage(req: Request, res: Response) {
  return res.render("messages");
}

export async function getUserDataById(req: Request, res: Response) {
  let userId = req.params.userId;
  try {
    let user = await User.findOne({ _id: userId }).select(
      "name surname profilePic"
    );
    if (user) {
      res.status(200).json({ user: user });
    } else {
      res.status(400).json({ user: null });
    }
  } catch (err) {
    if (err) {
      if (err) {
        console.log(err);
      }
    }
  }
}

export async function sendMessageToUser(req: Request, res: Response) {
  let reciverId = req.params.reciverId;
  let senderId = req.params.senderId;
  let messageContent = req.body.message;



  try {
    if (reciverId && senderId && messageContent) {
      let newMessage = await Message.create({
        reciver: reciverId,
        sender: senderId,
        content: messageContent,
      });

      const io = getSocketIo();
      io.emit("messageSaved",{message:newMessage});
      return res.status(201).json({ sent: true });
    }
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
}

export async function getMessages(req: Request, res: Response){
  let reciverId = req.params.reciverId;
  let senderId = req.params.senderId;

  try {
    if(reciverId && senderId){
      let messages = await Message.find({$or:[{reciver:reciverId},{sender:senderId},{reciver:senderId},{sender:reciverId}]})
      .populate("reciver")
      .populate("sender")
      return res.status(200).json(messages);
    }
    
  } catch (err) {
    if(err){
      console.log(err);
    }
    
  }
}

export async function setMessagesAsRead(req: Request, res: Response){
  let senderId = req.params.senderId;
  let userId = req.params.userId;
  try {
    let updateMessages = await Message.updateMany({reciver:userId,sender:senderId},{"$set":{"isRead":true}});
    return res.status(200).json({updated:true});
  } catch (err) {
    if(err){
      console.log(err);
    }
    
  }

  
}

export async function getUnreadMessageCount(req: Request, res: Response){
  let userId = req.params.userId;
  try {
    let messageCount = await Message.where({reciver:userId,isRead:false}).find().count();
    return res.status(200).json({unreadCount:messageCount});
  } catch (err) {
    if(err){
      if(err)
        console.log(err)
    }
    
  }
}
