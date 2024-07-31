import express,{Request,Response,NextFunction,Router} from 'express';
import * as auth from '../../middlewares/user.auth';
import * as controller from './user.controller';

const router:Router = express.Router();

router
    .route('/sign')
    .post(controller.signUp);

router
    .route('/login')
    .post(controller.singIn);

export default router;