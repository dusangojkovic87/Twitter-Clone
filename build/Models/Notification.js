"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
exports.notification = new mongoose_2.Schema({
    sender: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
    reciver: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    isRead: { type: Boolean, default: false },
    type: { type: String }
});
const Notification = mongoose_1.default.model("Notification", exports.notification);
exports.default = Notification;
//# sourceMappingURL=Notification.js.map