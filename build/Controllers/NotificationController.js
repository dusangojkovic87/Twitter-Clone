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
exports.getNotifications = exports.getNotificationPage = void 0;
const Notification_1 = __importDefault(require("../Models/Notification"));
function getNotificationPage(req, res) {
    return res.render("notifications");
}
exports.getNotificationPage = getNotificationPage;
function getNotifications(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let loggedUserId = req.session.userId;
        try {
            let notifications = yield Notification_1.default.find({ reciver: loggedUserId }).populate("sender");
            return res.status(200).json(notifications);
        }
        catch (err) {
            if (err) {
                console.log(err);
            }
        }
    });
}
exports.getNotifications = getNotifications;
//# sourceMappingURL=NotificationController.js.map