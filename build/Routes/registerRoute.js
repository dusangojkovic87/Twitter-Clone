"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const RegisterController_1 = require("../Controllers/RegisterController");
let router = express_1.default.Router();
router.get('/', RegisterController_1.getRegisterPage);
module.exports = router;
