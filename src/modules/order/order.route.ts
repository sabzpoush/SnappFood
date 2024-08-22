import express,{Request,Response,NextFunction,Router} from 'express';
import * as controller from './order.controller';
import * as auth from '../../middlewares/user.auth';

const router:Router = express.Router();

router
    .route('/show')
    .get(auth.authUser,controller.createOrder);

router  
    .route('/submit')
    .post(auth.authUser,controller.submitOrder);

router 
    .route('/all')
    .get(controller.allOrders);

export default router;