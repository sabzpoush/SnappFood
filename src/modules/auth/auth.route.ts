import express,{Express,Request,Response,Router,NextFunction} from 'express';
import * as controller from './auth.controller';


const router:Router = express.Router();

router
    .route('/send/code')
    .post(controller.verifyEmail);

router
    .route('/check/token')
    .post(controller.rememberMe);

export default router;