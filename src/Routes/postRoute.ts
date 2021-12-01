import {postTweet} from '../Controllers/PostController';
import express from 'express';
let router = express.Router();

router.post('/',postTweet);

export = router;

