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
exports.followUser = exports.getLikesDetailsPage = exports.getTweetsWithRepliesDetailsPage = exports.getDetailsPageTweets = exports.getDetailsPageData = exports.getMyLikes = exports.getTweetsWithReplies = exports.getMyTweets = exports.postEditProfile = exports.postProfileImage = exports.postBackgroundImage = exports.getUserProfile = void 0;
const validator_1 = __importDefault(require("validator"));
const Post_1 = __importDefault(require("../Models/Post"));
const User_1 = __importDefault(require("../Models/User"));
//logged user data
function getUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield User_1.default.findOne({ _id: req.session.userId });
        let tweetCount = yield Post_1.default.find({ postedBy: req.session.userId });
        return res.render("profile", { user: user, tweetCount: tweetCount.length });
    });
}
exports.getUserProfile = getUserProfile;
function postBackgroundImage(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const originalName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname;
        const pathToFile = `/uploads/background/${originalName}`;
        try {
            let user = yield User_1.default.findOneAndUpdate({ _id: req.session.userId }, { bgImage: pathToFile }, { useFindAndModify: false });
            return res.redirect("/profile");
        }
        catch (err) {
            if (err) {
                console.log(err);
            }
        }
        return;
    });
}
exports.postBackgroundImage = postBackgroundImage;
function postProfileImage(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const originalName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname;
        const pathToFile = `/uploads/profile/${originalName}`;
        try {
            let user = yield User_1.default.findOneAndUpdate({ _id: req.session.userId }, { profilePic: pathToFile }, { useFindAndModify: false });
            return res.redirect("/profile");
        }
        catch (err) {
            if (err) {
                console.log(err);
            }
        }
        return;
    });
}
exports.postProfileImage = postProfileImage;
function postEditProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { content } = req.body;
        if (validator_1.default.isEmpty(content.name) || validator_1.default.isEmpty(content.surname)) {
            res.status(401).json({ success: false });
            return;
        }
        const userInfoUpdate = {
            name: content.name,
            surname: content.surname,
            bio: content.bio,
            location: content.location,
            birthdate: content.birthdate,
        };
        const options = { upsert: true };
        try {
            let updateUser = yield User_1.default.updateOne({ _id: req.session.userId }, { $set: userInfoUpdate }, options);
            if (updateUser != null) {
                res.status(200).json({ success: true });
                return;
            }
        }
        catch (err) {
            if (err)
                console.log(err);
        }
        return;
    });
}
exports.postEditProfile = postEditProfile;
function getMyTweets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let posts = yield Post_1.default.find({ postedBy: req.session.userId })
                .where({ replyToUser: null })
                .populate("postedBy", "-password")
                .populate("originalTweet")
                .populate("originalTweetSender")
                .populate("retweeter");
            return res.status(200).json(posts);
        }
        catch (err) {
            if (err)
                console.log(err);
        }
    });
}
exports.getMyTweets = getMyTweets;
function getTweetsWithReplies(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let replies = yield Post_1.default.find({ postedBy: req.session.userId })
                .populate("postedBy", "-password")
                .populate("replyToUser", "-password")
                .populate("originalTweet")
                .populate("originalTweetSender")
                .populate("retweeter")
                .sort({ createdAt: -1 });
            res.status(200).json(replies);
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.getTweetsWithReplies = getTweetsWithReplies;
function getMyLikes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let likes = yield Post_1.default.find({ likes: req.session.userId })
                .populate("postedBy", "-password")
                .populate("replyToUser", "-password")
                .populate("originalTweet")
                .populate("originalTweetSender")
                .populate("retweeter");
            res.status(200).json(likes);
        }
        catch (err) {
            if (err) {
                console.log(err);
            }
        }
    });
}
exports.getMyLikes = getMyLikes;
//details page
function getDetailsPageData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.params.userId;
        let user = yield User_1.default.findOne({ _id: userId });
        let tweetCount = yield Post_1.default.find({ postedBy: userId });
        return res.render("details", { user: user, tweetCount: tweetCount.length });
    });
}
exports.getDetailsPageData = getDetailsPageData;
function getDetailsPageTweets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.params.userId;
        try {
            let posts = yield Post_1.default.find({ postedBy: userId })
                .where({ replyToUser: null })
                .populate("postedBy", "-password")
                .populate("originalTweet")
                .populate("originalTweetSender")
                .populate("retweeter");
            return res.status(200).json(posts);
        }
        catch (err) {
            if (err)
                console.log(err);
        }
    });
}
exports.getDetailsPageTweets = getDetailsPageTweets;
function getTweetsWithRepliesDetailsPage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.params.userId;
        try {
            let replies = yield Post_1.default.find({ postedBy: userId })
                .populate("postedBy", "-password")
                .populate("replyToUser", "-password")
                .populate("originalTweet")
                .populate("originalTweetSender")
                .populate("retweeter")
                .sort({ createdAt: -1 });
            res.status(200).json(replies);
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.getTweetsWithRepliesDetailsPage = getTweetsWithRepliesDetailsPage;
function getLikesDetailsPage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.params.userId;
        try {
            let likes = yield Post_1.default.find({ likes: userId })
                .populate("postedBy", "-password")
                .populate("replyToUser", "-password")
                .populate("originalTweet")
                .populate("originalTweetSender")
                .populate("retweeter");
            res.status(200).json(likes);
        }
        catch (err) {
            if (err) {
                console.log(err);
            }
        }
    });
}
exports.getLikesDetailsPage = getLikesDetailsPage;
function followUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let loggedUserId = req.session.userId;
        let userId = req.params.userId;
        if (loggedUserId != null && userId != null) {
            try {
                let userToFollow = yield User_1.default.findOne({ _id: userId });
                let isFollowing = userToFollow.followers.includes(loggedUserId);
                if (isFollowing) {
                    yield User_1.default.updateOne({ _id: userId }, { $pull: { followers: loggedUserId } });
                    yield User_1.default.updateOne({ _id: loggedUserId }, { $pull: { following: userId } });
                    let data = {
                        userId: userId,
                        unfollow: true,
                    };
                    return res.status(200).json(data);
                }
                let updateUserToFollow = yield User_1.default.updateOne({ _id: userId }, { followers: loggedUserId });
                let updateLoggedUser = yield User_1.default.updateOne({ _id: loggedUserId }, { following: userId });
                let data = {
                    userId: userId,
                    follow: true,
                };
                return res.status(200).json(data);
            }
            catch (err) {
                if (err) {
                    console.log(err);
                }
            }
        }
    });
}
exports.followUser = followUser;
//# sourceMappingURL=ProfileController.js.map