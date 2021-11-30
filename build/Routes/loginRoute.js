"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const LoginController_1 = require("../Controllers/LoginController");
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
router.get('/', LoginController_1.getLoginPage);
router.post('/', LoginController_1.postLogin);
module.exports = router;
