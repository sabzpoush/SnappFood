import express,{Express,Request,Response,Router} from 'express';
import * as auth from '../../middlewares/owner.auth';
import * as controller from './category.controller';
import * as validator from './../../utils/validators/category.validator';
import {validate} from './../../middlewares/validate';


const router:Router = express.Router();

router
    .route('/new')
    .post(auth.authOwner,controller.newCategory);

router 
    .route('/delete')
    .delete(auth.authOwner,validator.deleteCategory(),validate,controller.deleteCategory);

router
    .route('/self')
    .post(auth.authOwner,controller.selfCategory);

    
export default router;