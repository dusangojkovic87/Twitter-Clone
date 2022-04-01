"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadMessageCount = exports.setMessagesAsRead = exports.getMessages = exports.sendMessageToUser = exports.getUserDataById = exports.getMessagesPage = void 0;
const User_1 = __importDefault(require("../Models/User"));
const Message_1 = __importDefault(require("../Models/Message"));
const server_1 = __importDefault(require("../server"));
function getMessagesPage(req, res) {
    return res.render("messages");
}
exports.getMessagesPage = getMessagesPage;
function getUserDataById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.params.userId;
        try {
            let user = yield User_1.default.findOne({ _id: userId }).select("name surname profilePic");
            if (user) {
                res.status(200).json({ user: user });
            }
            else {
                res.status(400).json({ user: null });
            }
        }
        catch (err) {
            if (err) {
                if (err) {
                    console.log(err);
                }
            }
        }
    });
}
exports.getUserDataById = getUserDataById;
function sendMessageToUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let reciverId = req.params.reciverId;
        let senderId = req.params.senderId;
        let messageContent = req.body.message;
        try {
            if (reciverId && senderId && messageContent) {
                let newMessage = yield Message_1.default.create({
                    reciver: reciverId,
                    sender: senderId,
                    content: messageContent,
                });
                const io = (0, server_1.default)();
                io.emit("messageSaved", { message: newMessage });
                return res.status(201).json({ sent: true });
            }
        }
        catch (err) {
            if (err) {
                console.log(err);
            }
        }
    });
}
exports.sendMessageToUser = sendMessageToUser;
function getMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let reciverId = req.params.reciverId;
        let senderId = req.params.senderId;
        try {
            if (reciverId && senderId) {
                let messages = yield Message_1.default.find({ $or: [{ reciver: reciverId }, { sender: senderId }, { reciver: senderId }, { sender: reciverId }] })
                    .populate("reciver")
                    .populate("sender");
                return res.status(200).json(messages);
            }
        }
        catch (err) {
            if (err) {
                console.log(err);
            }
        }
    });
}
exports.getMessages = getMessages;
function setMessagesAsRead(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let senderId = req.params.senderId;
        let userId = req.params.userId;
        try {
            let updateMessages = yield Message_1.default.updateMany({ reciver: userId, sender: senderId }, { "$set": { "isRead": true } });
            return res.status(200).json({ updated: true });
        }
        catch (err) {
            if (err) {
                console.log(err);
            }
        }
    });
}
exports.setMessagesAsRead = setMessagesAsRead;
function getUnreadMessageCount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.params.userId;
        try {
            let messageCount = yield Message_1.default.where({ reciver: userId, isRead: false }).find().count();
            return res.status(200).json({ unreadCount: messageCount });
        }
        catch (err) {
            if (err) {
                if (err)
                    console.log(err);
            }
        }
    });
}
exports.getUnreadMessageCount = getUnreadMessageCount;
//# sourceMappingURL=MessagesController.js.map