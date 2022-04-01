"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const PostController_1 = require("../Controllers/PostController");
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
router.post('/', PostController_1.postTweet);
router.get('/:id', PostController_1.getPostById);
router.post('/:postId/:userId', PostController_1.replyToPost);
router.post('/like', PostController_1.likeAPost);
router.get('/replyModal/:postId/:replierId', PostController_1.getTweetDataForReplyModal);
router.post('/replyFromModal/:userId/:postId/:replierId', PostController_1.replyFromModal);
router.post('/retweet/:postId/:userId/:retweeterId', PostController_1.retweetPost);
router.delete('/remove/:postId/:userId', PostController_1.deleteTweet);
module.exports = router;
//# sourceMappingURL=postRoute.js.map