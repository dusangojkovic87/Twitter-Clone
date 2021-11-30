import HomeController from '../Controllers/HomeController';
import express,{Request,Response} from 'express';
let router = express.Router();

router.get('/',HomeController);



export = router;


 