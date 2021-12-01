import express,{Request,Response} from 'express';
import {getRegisterPage,postRegister} from '../Controllers/RegisterController';
let router = express.Router();

router.get('/',getRegisterPage);
router.post('/',postRegister);



export = router;