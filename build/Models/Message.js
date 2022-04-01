"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
exports.messageSchema = new mongoose_2.Schema({
    sender: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
    reciver: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });
const Message = mongoose_1.default.model("Message", exports.messageSchema);
exports.default = Message;
//# sourceMappingURL=Message.js.map