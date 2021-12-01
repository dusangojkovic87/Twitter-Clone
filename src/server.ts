import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from 'express-session';
import cookieParser from "cookie-parser";

declare module 'express-session' {
  interface SessionData {
    isAuth: boolean;
  }
}

const app = express();

import HomeRoute from "./Routes/homeRoute";
import LoginRoute from "./Routes/loginRoute";
import RegisterRoute from "./Routes/registerRoute";
import LogoutRoute from "./Routes/logoutRoute";



const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({secret:'secretkey',saveUninitialized:true,cookie:{maxAge:oneDay},resave:false}));
app.use(cookieParser());

/*Routes*/

app.use("/", HomeRoute);
app.use("/login", LoginRoute);
app.use("/register", RegisterRoute);
app.use("/logout", LogoutRoute);



/*db connection*/
mongoose
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
