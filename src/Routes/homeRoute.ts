import {defaultHome,getAllTweets, searchTwitter} from '../Controllers/HomeController';
import express from 'express';
import {isAuthenticated} from '../Middleware/AuthMiddleware';
let router = express.Router();

router.get('/',isAuthenticated,defaultHome);
router.get('/home',getAllTweets);
router.post("/home/searchTwitter/:searchTerm",searchTwitter)



export = router;


 