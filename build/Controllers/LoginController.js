"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogin = exports.getLoginPage = void 0;
function getLoginPage(req, res) {
    res.render('login');
}
exports.getLoginPage = getLoginPage;
;
function postLogin(req, res) {
    console.log(req.body);
    res.redirect('/');
}
exports.postLogin = postLogin;
