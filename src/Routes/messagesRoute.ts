import {getMessagesPage,getUserDataById,sendMessageToUser,getMessages,setMessagesAsRead,getUnreadMessageCount} from "../Controllers/MessagesController";
import express from 'express';
let router = express.Router();

router.get("/",getMessagesPage);
router.get("/getReciver/:userId",getUserDataById);
router.post("/send/:reciverId/:senderId",sendMessageToUser);
router.get("/getall/:reciverId/:senderId",getMessages);
router.post("/setAsRead/:senderId/:userId",setMessagesAsRead);
router.get("/unreadCount/:userId",getUnreadMessageCount);


export = router;