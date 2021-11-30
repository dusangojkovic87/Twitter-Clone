import express from "express";
import path from "path";
import bodyParser from "body-parser";
import mongoose from 'mongoose';


const app = express();

import HomeRoutes from "./Routes/homeRoutes";

const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());

/*Routes*/
app.use("/", HomeRoutes);
mongoose.connect('mongodb://localhost:27017/TwitterClone',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(() =>{
    app.listen(PORT, () => {
        console.log(`Server listens on ˘${PORT}`);
  });
})
.catch((err) =>{
   throw err;
})

