"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
function logout(req, res) {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                throw err;
            }
            res.cookie('connect.sid', null, {
                expires: new Date('Thu, 01 Jan 1970 00:00:00 UTC'),
                httpOnly: true,
            });
            res.clearCookie("loggedUser");
            res.redirect('/login');
        });
    }
}
exports.logout = logout;
//# sourceMappingURL=LogoutController.js.map