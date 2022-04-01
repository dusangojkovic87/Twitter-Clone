import {postTweet,getPostById,replyToPost, likeAPost,getTweetDataForReplyModal,replyFromModal, retweetPost,deleteTweet} from '../Controllers/PostController';
import express from 'express';
let router = express.Router();

router.post('/',postTweet);
router.get('/:id',getPostById);
router.post('/:postId/:userId',replyToPost);
router.post('/like',likeAPost);
router.get('/replyModal/:postId/:replierId',getTweetDataForReplyModal);
router.post('/replyFromModal/:userId/:postId/:replierId',replyFromModal);
router.post('/retweet/:postId/:userId/:retweeterId',retweetPost);
router.delete('/remove/:postId/:userId',deleteTweet);




export = router;

