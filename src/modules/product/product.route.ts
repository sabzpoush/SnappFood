import express,{Express,Router,Request,Response,NextFunction} from 'express';
import * as auth from '../../middlewares/owner.auth';
import * as controller from './product.controller';

const router:Router = express.Router();


router
    .route('/manage')
    .post(auth.authOwner,controller.newProduct)
    .delete(auth.authOwner,controller.selfRestProduct)

router
    .route('/delete')
    .delete(auth.authOwner,controller.deleteProduct);

router
    .route('/price')
    .put(auth.authOwner,controller.changeProductPrice);

router
    .route('/top-purchased')
    .get(controller.topPurchasedProduct);

router
    .route('/active-status')
    .put(auth.authOwner,controller.changeProductIsActive);

export default router;