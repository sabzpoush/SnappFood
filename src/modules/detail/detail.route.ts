import express,{Request,Response,NextFunction,Router} from 'express';
import * as controller from './detail.controller';

const router:Router = express.Router();

router
    .route('/restaurant-menu')
    .get(controller.restaurantMenu);

export default router;

