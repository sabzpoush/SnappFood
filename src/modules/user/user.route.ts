import express,{Request,Response,NextFunction,Router} from 'express';
import * as auth from '../../middlewares/user.auth';
import * as controller from './user.controller';
import * as middleware from '../../middlewares/code.validation';


const router:Router = express.Router();

router
    .route('/sign')
    .post(controller.signUp);

router
    .route('/login')
    .post(controller.singIn);

router
    .route('/signin')
    .post(middleware.validateEmail,controller.signUpOrSignIn);

export default router;