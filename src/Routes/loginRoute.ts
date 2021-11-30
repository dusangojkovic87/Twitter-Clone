import {getLoginPage,postLogin} from '../Controllers/LoginController';
import express,{Request,Response} from 'express';
let router = express.Router();

router.get('/',getLoginPage);

router.post('/',postLogin);

export = router;
