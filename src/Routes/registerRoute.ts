import express,{Request,Response} from 'express';
import {getRegisterPage} from '../Controllers/RegisterController';
let router = express.Router();

router.get('/',getRegisterPage);

export = router;