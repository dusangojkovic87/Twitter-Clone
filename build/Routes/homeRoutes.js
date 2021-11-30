"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const HomeController_1 = __importDefault(require("../Controllers/HomeController"));
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
router.get('/', HomeController_1.default);
module.exports = router;
