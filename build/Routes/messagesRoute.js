"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const MessagesController_1 = require("../Controllers/MessagesController");
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
router.get("/", MessagesController_1.getMessagesPage);
router.get("/getReciver/:userId", MessagesController_1.getUserDataById);
router.post("/send/:reciverId/:senderId", MessagesController_1.sendMessageToUser);
router.get("/getall/:reciverId/:senderId", MessagesController_1.getMessages);
router.post("/setAsRead/:senderId/:userId", MessagesController_1.setMessagesAsRead);
router.get("/unreadCount/:userId", MessagesController_1.getUnreadMessageCount);
module.exports = router;
//# sourceMappingURL=messagesRoute.js.map