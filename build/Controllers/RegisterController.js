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
exports.postRegister = exports.getRegisterPage = void 0;
const User_1 = __importDefault(require("../Models/User"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function getRegisterPage(req, res) {
    res.render("register");
}
exports.getRegisterPage = getRegisterPage;
function postRegister(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, surname, email, password } = req.body;
        if (validator_1.default.isEmpty(name) ||
            validator_1.default.isEmpty(surname) ||
            validator_1.default.isEmpty(email) ||
            validator_1.default.isEmpty(password)) {
            res.render("register", { errorMessage: "Fields cannot be empty!" });
            return;
        }
        if (!validator_1.default.isEmail(email)) {
            res.render("register", { errorMessage: "Email is not valid!" });
            return;
        }
        let user = yield User_1.default.findOne({ email: email });
        if (user) {
            res.render("register", { errorMessage: "User already exists!" });
            return;
        }
        let salt = yield bcrypt_1.default.genSalt(10);
        let hashedPass = yield bcrypt_1.default.hash(password, salt);
        let newUser = new User_1.default({
            name: name,
            surname: surname,
            email: email,
            password: hashedPass,
        });
        newUser
            .save()
            .then(() => {
            res.redirect("login");
            return;
        })
            .catch(() => {
            res.render("register", { errorMessage: "Error,user not saved!" });
            return;
        });
    });
}
exports.postRegister = postRegister;
