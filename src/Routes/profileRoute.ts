import {getUserProfile,postBackgroundImage,postProfileImage,postEditProfile, getMyTweets, getTweetsWithReplies, getMyLikes,getDetailsPageData,getDetailsPageTweets,getTweetsWithRepliesDetailsPage,getLikesDetailsPage,followUser} from "../Controllers/ProfileController";
import {isAuthenticated} from "../Middleware/AuthMiddleware"
import express from 'express';
import multer from "multer";

const bgImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'build/Public/uploads/background')
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname);
    }
  });

  const profileImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'build/Public/uploads/profile')
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname);
    }
  });

  const uploadBgImage = multer({ storage: bgImageStorage });
  const uploadProfileImage = multer({ storage: profileImageStorage });



let router = express.Router();

router.get('/',isAuthenticated,getUserProfile);
router.post('/background',uploadBgImage.single('bgImage'),postBackgroundImage);
router.post("/profilePic",uploadProfileImage.single("profilePic"),postProfileImage);
router.post('/editProfile',postEditProfile);
router.get("/myTweets",getMyTweets);
router.get('/replies',getTweetsWithReplies);
router.get('/likes',getMyLikes);

//profile details
router.get("/details/:userId",getDetailsPageData);
router.get("/details/tweets/:userId",getDetailsPageTweets);
router.get("/details/replies/:userId",getTweetsWithRepliesDetailsPage);
router.get("/details/likes/:userId",getLikesDetailsPage);
router.post("/details/follow/:userId",followUser);



export = router;

