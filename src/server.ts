import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from 'express-session';
import cookieParser from "cookie-parser";
import cors from 'cors';

declare module 'express-session' {
  interface SessionData {
    isAuth: boolean;
    userId:String;
  }
}

const app = express();

import HomeRoute from "./Routes/homeRoute";
import LoginRoute from "./Routes/loginRoute";
import RegisterRoute from "./Routes/registerRoute";
import LogoutRoute from "./Routes/logoutRoute";
import PostRoute from "./Routes/postRoute";

  





const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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
app.use("/post", PostRoute);



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
