import express,{Request,Response,NextFunction,Router} from 'express';
import * as controller from './order.controller';

const router:Router = express.Router();

router
    .route('')
    .post()

export default router;