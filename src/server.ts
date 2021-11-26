import express,{Request,Response} from 'express';
const app = express();

const PORT = 3000;

app.listen(PORT,() =>{
    console.log(`Server listens on ˘${PORT}`);
});

app.get('/',(req:Request,res:Response) =>{
    res.send("Radi");
});