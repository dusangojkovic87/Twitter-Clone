"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const moment_1 = __importDefault(require("moment"));
const http = __importStar(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const homeRoute_1 = __importDefault(require("./Routes/homeRoute"));
const loginRoute_1 = __importDefault(require("./Routes/loginRoute"));
const registerRoute_1 = __importDefault(require("./Routes/registerRoute"));
const logoutRoute_1 = __importDefault(require("./Routes/logoutRoute"));
const postRoute_1 = __importDefault(require("./Routes/postRoute"));
const profileRoute_1 = __importDefault(require("./Routes/profileRoute"));
const messagesRoute_1 = __importDefault(require("./Routes/messagesRoute"));
const notificationsRoute_1 = __importDefault(require("./Routes/notificationsRoute"));
const addUserSession_1 = require("./Middleware/addUserSession");
app.locals.moment = moment_1.default;
const PORT = 3000;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/uploads", express_1.default.static("upoloads"));
app.use(express_1.default.json());
const oneDay = 1000 * 60 * 60 * 24;
app.use((0, express_session_1.default)({ secret: 'secretkey', saveUninitialized: true, cookie: { maxAge: oneDay }, resave: false }));
app.use((0, cookie_parser_1.default)());
app.use(addUserSession_1.addUserSession);
//socket io
const server = http.createServer(app);
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    console.log("socket io running...");
});
function getSocketIo() {
    return io;
}
exports.default = getSocketIo;
/*Routes*/
app.use("/", homeRoute_1.default);
app.use("/login", loginRoute_1.default);
app.use("/register", registerRoute_1.default);
app.use("/logout", logoutRoute_1.default);
app.use("/post", postRoute_1.default);
app.use("/profile", profileRoute_1.default);
app.use("/messages", messagesRoute_1.default);
app.use("/notifications", notificationsRoute_1.default);
/*db connection*/
mongoose_1.default
    .connect("mongodb://localhost:27017/TwitterClone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    /* app.listen(PORT, () => {
      console.log(`Server listens on ˘${PORT}`);
    }); */
    server.listen(PORT, () => {
        console.log(`Server listens on ${PORT}`);
    });
})
    .catch((err) => {
    throw err;
});
//# sourceMappingURL=server.js.map