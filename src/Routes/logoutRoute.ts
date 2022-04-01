import express from 'express';
let router = express.Router();
import {logout} from '../Controllers/LogoutController';

router.get('/',logout);
export = router;