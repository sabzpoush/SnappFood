import express,{Express,Request,Response,Router,NextFunction} from 'express';
import * as controller from './auth.controller';


const router:Router = express.Router();

router
    .route('/verify-email')
    .post(controller.verifyEmail);

router
    .route('/remember-me')
    .post(controller.rememberMe);

export default router;