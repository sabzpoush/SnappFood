import express,{Express,Request,Response,NextFunction,Router} from 'express';
import * as auth from '../../middlewares/user.auth';
import * as controller from './cart.controller';

const router:Router = express.Router();

router
    .route('/manage')
    .post(auth.authUser,controller.addToCart);

router
    .route('/my')
    .post(auth.authUser,controller.myCart);

router 
    .route('/detail')
    .get(auth.authUser,controller.detailOfCart);

router
    .route('/remove')
    .delete(auth.authUser,controller.deleteFromCart);

router
    .route('/clear')
    .delete(auth.authUser,controller.clearCart);

router 
    .route('/decrease')
    .post(auth.authUser,controller.decreaseProductCount);


export default router;