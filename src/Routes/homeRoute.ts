import HomeController from '../Controllers/HomeController';
import express from 'express';
import {isAuthenticated} from '../Middleware/AuthMiddleware';
let router = express.Router();

router.get('/',isAuthenticated,HomeController);



export = router;


 