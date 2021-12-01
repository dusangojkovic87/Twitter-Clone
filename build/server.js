"use strict";
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
const app = (0, express_1.default)();
const homeRoute_1 = __importDefault(require("./Routes/homeRoute"));
const loginRoute_1 = __importDefault(require("./Routes/loginRoute"));
const registerRoute_1 = __importDefault(require("./Routes/registerRoute"));
const logoutRoute_1 = __importDefault(require("./Routes/logoutRoute"));
const PORT = 3000;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.json());
const oneDay = 1000 * 60 * 60 * 24;
app.use((0, express_session_1.default)({ secret: 'secretkey', saveUninitialized: true, cookie: { maxAge: oneDay }, resave: false }));
app.use((0, cookie_parser_1.default)());
/*Routes*/
app.use("/", homeRoute_1.default);
app.use("/login", loginRoute_1.default);
app.use("/register", registerRoute_1.default);
app.use("/logout", logoutRoute_1.default);
/*db connection*/
mongoose_1.default
    .connect("mongodb://localhost:27017/TwitterClone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server listens on ˘${PORT}`);
    });
})
    .catch((err) => {
    throw err;
});
