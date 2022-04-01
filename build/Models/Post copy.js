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
    originalTweet: { type: mongoose_2.Schema.Types.ObjectId, ref: "Post" },
    originalTweetSender: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
    retweeter: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
    retweeterList: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }],
    isRetweet: { type: Boolean, default: false },
    replyTo: { type: mongoose_2.Schema.Types.ObjectId, ref: "Post" },
    replyToUser: { type: mongoose_2.Schema.Types.ObjectId, ref: "User" },
    replyCount: { type: Number, default: 0 }
}, { timestamps: true });
const Post = mongoose_1.default.model("Post", exports.post);
exports.default = Post;
//# sourceMappingURL=Post%20copy.js.map