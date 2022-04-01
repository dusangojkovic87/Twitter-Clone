"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogin = exports.getLoginPage = void 0;
const User_1 = __importDefault(require("../Models/User"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function getLoginPage(req, res) {
    res.render('login');
}
exports.getLoginPage = getLoginPage;
;
function postLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (validator_1.default.isEmpty(email) || validator_1.default.isEmpty(password)) {
            res.render('login', { errorMessage: 'fields cannot be empty!' });
            return;
        }
        if (!validator_1.default.isEmail(email)) {
            res.render('login', { errorMessage: 'Email is not valid!' });
            return;
        }
        let user = yield User_1.default.findOne({ email: email });
        if (user == null || user == undefined) {
            res.render('login', { errorMessage: 'User does not exists!' });
            return;
        }
        let isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (isMatch) {
            let { _id } = user;
            let idString = _id.toString();
            req.session.isAuth = true;
            req.session.user = user;
            req.session.userId = user._id;
            res.cookie('loggedUser', idString);
            res.redirect('/');
            return;
        }
        else {
            req.session.isAuth = false;
            res.render('login', { errorMessage: 'Wrong password!' });
            return;
        }
    });
}
exports.postLogin = postLogin;
//# sourceMappingURL=LoginController.js.map