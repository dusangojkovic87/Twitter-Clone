import express from 'express';
import { getNotificationPage,getNotifications } from '../Controllers/NotificationController';
let router = express.Router();

router.get("/",getNotificationPage);
router.get("/getNotifications",getNotifications);

export = router;