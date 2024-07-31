import express,{Express,Router,Request,Response,NextFunction} from 'express';
import * as auth from '../../middlewares/owner.auth';
import * as controller from './product.controller';

const router:Router = express.Router();


router
    .route('/new')
    .post(auth.authOwner,controller.newProduct);

router
    .route('/self')
    .post(auth.authOwner,controller.selfRestProduct);

export default router;