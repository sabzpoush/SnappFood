import express,{Express,Request,Response,NextFunction,Router} from 'express';
import * as controller from './restaurant.controller'; 
import * as validator from '../../utils/validators/restaurant.validator';
import {validate} from '../../middlewares/validate';
import * as auth from '../../middlewares/owner.auth';
import { authUser } from '../../middlewares/user.auth';

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

router
    .route('/score')
    .post(authUser,validator.giveScore(),validate,controller.giveScore);

router
    .route('/top-score')
    .get(controller.topScoreRestaurant);

router
    .route('/top-viewed')
    .get(controller.topViewedRestaurant);

router
    .route('/top-order-count')
    .get(controller.topOrderCountRestaurant);

router
    .route('/delivery-price')
    .put(validator.changeDeliveryPrice(),validate,auth.authOwner,controller.changeDeliveryPrice);

export default router;

