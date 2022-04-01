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
exports.deleteTweet = exports.retweetPost = exports.replyFromModal = exports.getTweetDataForReplyModal = exports.likeAPost = exports.replyToPost = exports.getPostById = exports.postTweet = void 0;
const validator_1 = __importDefault(require("validator"));
const Post_1 = __importDefault(require("../Models/Post"));
const User_1 = __importDefault(require("../Models/User"));
const Notification_1 = __importDefault(require("../Models/Notification"));
const server_1 = __importDefault(require("../server"));
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
        let post = yield Post_1.default.findOne({ _id: req.params.id }).populate("postedBy", "-password");
        let replies = yield Post_1.default.find({ replyTo: req.params.id })
            .populate("postedBy", "-password")
            .populate("replyTo")
            .populate("replyToUser")
            .sort({ createdAt: -1 });
        res.render("post", { post: post, replies: replies });
    });
}
exports.getPostById = getPostById;
function replyToPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let postId = req.params.postId;
        let profileId = req.params.userId;
        let countReply = yield Post_1.default.countDocuments({ replyTo: postId });
        yield Post_1.default.findOneAndUpdate({ _id: postId }, { $set: { replyCount: ++countReply } });
        let replyPost = new Post_1.default({
            content: req.body.reply,
            replyTo: postId,
            postedBy: req.session.userId,
            replyToUser: profileId,
        });
        replyPost
            .save()
            .then(() => {
            res.redirect("/");
            return;
        })
            .catch((err) => {
            if (err) {
                console.log(err);
            }
            return;
        });
    });
}
exports.replyToPost = replyToPost;
function likeAPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.body.userId;
        let postId = req.body.postId;
        let senderId = req.session.userId;
        try {
            let post = yield Post_1.default.findOne({ _id: postId, likes: userId });
            if (post == null) {
                const options = { upsert: true };
                let updatedLikePost = yield Post_1.default.updateOne({ _id: postId }, { likes: userId }, options);
                let postFromDb = yield Post_1.default.findOne({ _id: postId });
                let likesCount = postFromDb.likes.length;
                let newNotification = new Notification_1.default({
                    sender: senderId,
                    reciver: postFromDb.postedBy,
                    content: "Liked your post",
                    type: "Post"
                });
                newNotification
                    .save()
                    .then((notification) => __awaiter(this, void 0, void 0, function* () {
                    let notificationInfo = yield Notification_1.default.findById(notification._id).populate("sender");
                    const io = (0, server_1.default)();
                    io.emit("likedPost", { notificationInfo: notificationInfo });
                }))
                    .catch((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                let data = {
                    liked: true,
                    likesCount: likesCount,
                };
                return res.status(200).json(data);
            }
            else {
                let updatedLikePost = yield Post_1.default.updateOne({ _id: postId }, { $pull: { likes: userId } });
                let postFromDb = yield Post_1.default.findOne({ _id: postId });
                let likesCount = postFromDb.likes.length;
                let data = {
                    liked: false,
                    likesCount: likesCount,
                };
                return res.status(200).json(data);
            }
        }
        catch (err) {
            if (err) {
                console.log(err);
            }
        }
    });
}
exports.likeAPost = likeAPost;
function getTweetDataForReplyModal(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let postId = req.params.postId;
            let replierId = req.params.replierId;
            let post = yield Post_1.default.findOne({ _id: postId }).populate("postedBy", "-password");
            let replier = yield User_1.default.findOne({ _id: replierId });
            let data = {
                post: post,
                replier: replier,
            };
            return res.status(200).json(data);
        }
        catch (err) {
            if (err) {
                console.log(err);
            }
        }
    });
}
exports.getTweetDataForReplyModal = getTweetDataForReplyModal;
function replyFromModal(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.params.userId;
        let postId = req.params.postId;
        let replierId = req.params.replierId;
        let countReply = yield Post_1.default.countDocuments({ replyTo: postId });
        yield Post_1.default.findOneAndUpdate({ _id: postId }, { $set: { replyCount: ++countReply } });
        let replyPost = new Post_1.default({
            content: req.body.reply,
            replyTo: postId,
            postedBy: replierId,
            replyToUser: userId,
        });
        replyPost
            .save()
            .then(() => {
            res.status(200).json({ success: true });
            return;
        })
            .catch(() => {
            res.status(400).json({ success: false });
            return;
        });
    });
}
exports.replyFromModal = replyFromModal;
function retweetPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.params.userId;
        let postId = req.params.postId;
        let retweeterId = req.params.retweeterId;
        let isRetweet = yield Post_1.default.findOne({ postedBy: retweeterId, retweeter: retweeterId });
        const options = { upsert: true };
        if (isRetweet == null) {
            yield Post_1.default.create({ postedBy: retweeterId, retweeter: retweeterId, isRetweet: true, originalTweet: postId, originalTweetSender: userId });
            //update retweeter count in original tweet
            yield Post_1.default.updateOne({ postedBy: userId }, { $push: { retweeterList: retweeterId } }, options);
            let data = {
                retweet: true,
                postId: postId
            };
            return res.status(200).json(data);
        }
        let postToDelete = yield Post_1.default.findOne({ retweeter: retweeterId });
        yield Post_1.default.findOneAndDelete({ retweeter: retweeterId });
        //update original tweet count if untweeted
        yield Post_1.default.updateOne({ postedBy: userId }, { $pull: { retweeterList: retweeterId } }, options);
        let data = {
            retweet: false,
            postId: postId,
            postToDeleteId: postToDelete._id
        };
        return res.status(200).json(data);
    });
}
exports.retweetPost = retweetPost;
function deleteTweet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let postId = req.params.postId;
        let userId = req.params.userId;
        try {
            let post = yield Post_1.default.findOne({ _id: postId }).populate('originalTweet');
            if (post.isRetweet === true) {
                let originalTweetId = post.originalTweet._id;
                let updateOriginalRetweetList = yield Post_1.default.updateOne({ _id: originalTweetId }, { $pull: { retweeterList: userId } });
                let isDeleted = yield Post_1.default.findOneAndDelete({ _id: postId });
                let data = {
                    deleted: true,
                    postId: postId,
                    userId: userId
                };
                return res.status(202).json(data);
            }
            if (post.isRetweet === false) {
                let isDeleted = yield Post_1.default.findOneAndDelete({ _id: postId });
                let data = {
                    deleted: true,
                    postId: postId,
                    userId: userId
                };
                return res.status(202).json(data);
            }
        }
        catch (err) {
            let data = {
                deleted: false,
                postId: postId,
                userId: userId
            };
            if (err) {
                res.status(400).json(data);
            }
        }
    });
}
exports.deleteTweet = deleteTweet;
//# sourceMappingURL=PostController.js.map