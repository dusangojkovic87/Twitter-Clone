"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ProfileController_1 = require("../Controllers/ProfileController");
const AuthMiddleware_1 = require("../Middleware/AuthMiddleware");
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const bgImageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'build/Public/uploads/background');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const profileImageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'build/Public/uploads/profile');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const uploadBgImage = (0, multer_1.default)({ storage: bgImageStorage });
const uploadProfileImage = (0, multer_1.default)({ storage: profileImageStorage });
let router = express_1.default.Router();
router.get('/', AuthMiddleware_1.isAuthenticated, ProfileController_1.getUserProfile);
router.post('/background', uploadBgImage.single('bgImage'), ProfileController_1.postBackgroundImage);
router.post("/profilePic", uploadProfileImage.single("profilePic"), ProfileController_1.postProfileImage);
router.post('/editProfile', ProfileController_1.postEditProfile);
router.get("/myTweets", ProfileController_1.getMyTweets);
router.get('/replies', ProfileController_1.getTweetsWithReplies);
router.get('/likes', ProfileController_1.getMyLikes);
//profile details
router.get("/details/:userId", ProfileController_1.getDetailsPageData);
router.get("/details/tweets/:userId", ProfileController_1.getDetailsPageTweets);
router.get("/details/replies/:userId", ProfileController_1.getTweetsWithRepliesDetailsPage);
router.get("/details/likes/:userId", ProfileController_1.getLikesDetailsPage);
router.post("/details/follow/:userId", ProfileController_1.followUser);
module.exports = router;
//# sourceMappingURL=profileRoute.js.map