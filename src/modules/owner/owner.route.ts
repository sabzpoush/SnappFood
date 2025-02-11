import express,{Request,Response,Express,Router} from 'express';
import * as controller from './owner.controller';
import * as validator from '../../utils/validators/owner.validator';

const router:Router = express.Router();


router
    .route('/register')
    .post(validator.register(),controller.register);
router
    .route('/reset-password')
    .post(controller.resetPassword);
router
    .route('/all-owners')
    .get(controller.allUsers);

router
    .route('/sign-in')
    .post(validator.singIn(),controller.singIn);

export default router;