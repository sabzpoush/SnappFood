import express, {Express,Request,Response} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

// Import The Routers
import ownerRouter from './modules/owner/owner.route';
import restRouter from './modules/restaurant/restaurant.route';
import categoryRouter from './modules/category/category.route';
import productRouter from './modules/product/product.route';
import userRouter from './modules/user/user.route';
import cartRouter from './modules/cart/cart.route';
import orderRouter from './modules/order/order.route';
import detailRouter from './modules/detail/detail.route';
import uploadRouter from './modules/upload/upload.route';
import authRouter from './modules/auth/auth.route';

import swaggerDocument from '../swagger.json';

// Init App
const app:Express = express();

// Init The Express Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json())
app.use(cookieParser('my-secret-key'));
app.use(express.urlencoded({extended:false}));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Init Swagger 
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Init The Express Static

// Init The Routers
app.use('/owner',ownerRouter);
app.use('/rest',restRouter);
app.use('/category',categoryRouter);
app.use('/product',productRouter);
app.use('/user',userRouter);
app.use('/cart',cartRouter);
app.use('/order',orderRouter);
app.use('/detail',detailRouter);
app.use('/upload',uploadRouter);
app.use('/auth',authRouter);

// Server Route 
app.get('/',(req:Request,res:Response)=>{
    res.status(200).json({message:'welcome'});
});

// Setup Sever Port
app.listen(3000,()=>{
    console.log('Server running on http://localhost:3000');
});

export default app;