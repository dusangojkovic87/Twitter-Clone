"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const homeRoutes_1 = __importDefault(require("./Routes/homeRoutes"));
const PORT = 3000;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.json());
/*Routes*/
app.use("/", homeRoutes_1.default);
mongoose_1.default.connect('mongodb://localhost:27017/TwitterClone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server listens on ˘${PORT}`);
    });
})
    .catch((err) => {
    throw err;
});
