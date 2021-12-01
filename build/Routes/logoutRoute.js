"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
const LogoutController_1 = require("../Controllers/LogoutController");
router.get('/', LogoutController_1.logout);
module.exports = router;
