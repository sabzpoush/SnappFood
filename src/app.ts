import express, {Express,Request,Response} from 'express';
import cors from 'cors';

const app:Express = express();

app.use(cors());

app.get('/',(req:Request,res:Response)=>{
    
});

app.listen(3000,()=>{
    console.log('Server running on http://localhost:3000');
});

