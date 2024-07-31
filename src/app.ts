import express, {Express,Request,Response} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import morgan from 'morgan';

// Import The Routers
import ownerRouter from './modules/owner/owner.route';
import restRouter from './modules/restaurant/restaurant.route';
import categoryRouter from './modules/category/category.route';
import productRouter from './modules/product/product.route';
import userRouter from './modules/user/user.route';
import cartRouter from './modules/cart/cart.route';


const app:Express = express();

// Init The Express Middlewares
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(cookieParser('my-secret-key'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Init The Express Static
app.use(express.static(''));

// Init The Routers
app.use('/owner',ownerRouter);
app.use('/rest',restRouter);
app.use('/category',categoryRouter);
app.use('/product',productRouter);
app.use('/user',userRouter);
app.use('/cart',cartRouter);


app.get('/',(req:Request,res:Response)=>{
    res.status(200).json({message:'welcome'});
});

app.listen(3000,()=>{
    console.log('Server running on http://localhost:3000');
});

