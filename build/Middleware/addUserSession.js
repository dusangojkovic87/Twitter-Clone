"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserSession = void 0;
function addUserSession(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.loggedUserId = req.session.userId;
    next();
}
exports.addUserSession = addUserSession;
//# sourceMappingURL=addUserSession.js.map