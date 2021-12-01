"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
function isAuthenticated(req, res, next) {
    if (req.session && req.session.isAuth === true) {
        next();
        res.redirect('/');
        return;
    }
    else {
        res.redirect("/login");
        return;
    }
}
exports.isAuthenticated = isAuthenticated;
