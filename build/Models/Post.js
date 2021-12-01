"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
exports.post = new mongoose_2.Schema({
    content: { type: String, trim: true },
    postedBy: { type: mongoose_2.Schema.Types.ObjectId, ref: "User" },
    pinned: Boolean,
    likes: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "User" }],
    retweetUsers: [{ type: mongoose_2.Schema.Types.ObjectId, ref: "User" }],
    retweetData: { type: mongoose_2.Schema.Types.ObjectId, ref: "Post" },
    replyTo: { type: mongoose_2.Schema.Types.ObjectId, ref: "Post" },
}, { timestamps: true });
const Post = mongoose_1.default.model("Post", exports.post);
exports.default = Post;
//# sourceMappingURL=Post.js.map