"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTweet = void 0;
const validator_1 = __importDefault(require("validator"));
const Post_1 = __importDefault(require("../Models/Post"));
function postTweet(req, res) {
    const { content } = req.body;
    if (validator_1.default.isEmpty(content)) {
        res.status(400).json({ success: false });
        return;
    }
    let newPost = new Post_1.default({
        content: content,
        postedBy: req.session.userId,
    });
    newPost
        .save()
        .then(() => {
        res.status(200).json({ success: true });
        return;
    })
        .catch(() => {
        res.status(500).json({ error: "Error on server!" });
    });
}
exports.postTweet = postTweet;
//# sourceMappingURL=PostController.js.map