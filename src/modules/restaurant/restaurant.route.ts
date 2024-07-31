import express,{Express,Request,Response,NextFunction,Router} from 'express';
import * as controller from './restaurant.controller'; 
import * as validator from '../../utils/validators/restaurant.validator';
import * as auth from '../../middlewares/owner.auth';

const router:Router = express.Router();

router
    .route('/create')
    .post(auth.authOwner,validator.create(),controller.createRest);

router
    .route('/self')
    .get(auth.authOwner,controller.ownerSelfRest);

router
    .route('/all')
    .get(controller.allRestaurant)

router
    .route('/search')
    .post(controller.searchRestaurant);


export default router;

