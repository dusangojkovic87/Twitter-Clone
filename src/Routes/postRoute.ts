import {postTweet,getPostById} from '../Controllers/PostController';
import express from 'express';
let router = express.Router();

router.post('/',postTweet);
router.get('/:id',getPostById);



export = router;

