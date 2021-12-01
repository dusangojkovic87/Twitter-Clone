"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const HomeController_1 = __importDefault(require("../Controllers/HomeController"));
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = require("../Middleware/AuthMiddleware");
let router = express_1.default.Router();
router.get('/', AuthMiddleware_1.isAuthenticated, HomeController_1.default);
module.exports = router;
//# sourceMappingURL=homeRoute.js.map