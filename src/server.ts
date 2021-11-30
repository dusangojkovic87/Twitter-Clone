import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();

import HomeRoutes from './Routes/homeRoutes';

const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());



/*Routes*/
 app.use('/',HomeRoutes); 


app.listen(PORT,() =>{
    console.log(`Server listens on ˘${PORT}`);
});
