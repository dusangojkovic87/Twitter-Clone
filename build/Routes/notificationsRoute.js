"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const NotificationController_1 = require("../Controllers/NotificationController");
let router = express_1.default.Router();
router.get("/", NotificationController_1.getNotificationPage);
router.get("/getNotifications", NotificationController_1.getNotifications);
module.exports = router;
//# sourceMappingURL=notificationsRoute.js.map