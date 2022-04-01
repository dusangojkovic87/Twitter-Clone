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
exports.searchTwitter = exports.getAllTweets = exports.defaultHome = void 0;
const Post_1 = __importDefault(require("../Models/Post"));
const User_1 = __importDefault(require("../Models/User"));
function defaultHome(req, res) {
    return res.render('home');
}
exports.defaultHome = defaultHome;
function getAllTweets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let posts = yield Post_1.default.find()
            .populate('postedBy', '-password')
            .populate('replyTo')
            .populate('replyToUser')
            .populate('retweeter')
            .populate('originalTweet')
            .populate('postedBy', '-password')
            .populate('originalTweetSender')
            .sort({ createdAt: -1 });
        return res.status(200).json({ posts: posts });
    });
}
exports.getAllTweets = getAllTweets;
function searchTwitter(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let searchTerm = req.params.searchTerm;
        console.log(searchTerm);
        try {
            if (searchTerm != null || searchTerm != 'undefined' || searchTerm != "") {
                let data = yield User_1.default.find({ 'name': new RegExp(searchTerm, 'i') });
                return res.status(200).json(data);
            }
            else {
                let data = {
                    empty: true
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
exports.searchTwitter = searchTwitter;
//# sourceMappingURL=HomeController.js.map