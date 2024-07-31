import express,{Express,Request,Response,Router} from 'express';
import * as auth from '../../middlewares/owner.auth';
import * as controller from './category.controller';


const router:Router = express.Router();

router
    .route('/new')
    .post(auth.authOwner,controller.newCategory);

router 
    .route('/delete')
    .post(auth.authOwner,controller.deleteCategory);

router
    .route('/self')
    .post(auth.authOwner,controller.selfCategory);

    
export default router;