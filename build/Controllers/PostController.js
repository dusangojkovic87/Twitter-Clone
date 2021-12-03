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
exports.getPostById = exports.postTweet = void 0;
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
function getPostById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let post = yield Post_1.default.findOne({ _id: req.params.id });
        res.render('post', { post: post });
    });
}
exports.getPostById = getPostById;
//# sourceMappingURL=PostController.js.map