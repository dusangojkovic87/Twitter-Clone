"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const HomeController_1 = require("../Controllers/HomeController");
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = require("../Middleware/AuthMiddleware");
let router = express_1.default.Router();
router.get('/', AuthMiddleware_1.isAuthenticated, HomeController_1.defaultHome);
router.get('/home', HomeController_1.getAllTweets);
router.post("/home/searchTwitter/:searchTerm", HomeController_1.searchTwitter);
module.exports = router;
//# sourceMappingURL=homeRoute.js.map