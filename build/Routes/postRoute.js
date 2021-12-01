"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const PostController_1 = require("../Controllers/PostController");
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
router.post('/', PostController_1.postTweet);
module.exports = router;
//# sourceMappingURL=postRoute.js.map