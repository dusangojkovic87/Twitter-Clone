"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
exports.user = new mongoose_2.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String, required: false },
    location: { type: String, required: false },
    birthdate: { type: Date, required: false },
    profilePic: { type: String, default: "/images/default.png" },
    bgImage: { type: String, default: "/images/bgdefault.jpg" },
    coverPhoto: { type: String },
    following: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }],
    /*  retweets:[{type:Schema.Types.ObjectId,ref:'Post'}] */
}, { timestamps: true });
const User = mongoose_1.default.model('User', exports.user);
exports.default = User;
//# sourceMappingURL=User.js.map