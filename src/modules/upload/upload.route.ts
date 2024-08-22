import express,{Request,Response,NextFunction,Router,Express} from 'express';
import * as controller from './upload.controller';
import uploader from '../../utils/upload/upload.util';
import * as auth from '../../middlewares/owner.auth';

const router:Router = express.Router();

import multerS3 from 'multer-s3';
import multer from 'multer';
import AWS from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';


const liara_endpoint = process.env.LIARA_ENDPOINT;
const liara_bucket_name = process.env.LIARA_BUCKET_NAME;
const liara_access_key = process.env.LIARA_ACCESS_KEY;
const liara_secert_key = process.env.LIARA_SECRET_KEY;

const config = {
    endpoint:liara_endpoint,
    accessKeyId:liara_access_key,
    secertAccessId:liara_secert_key,
    region:'default',
}
// npm install aws-sdk@2.1474.0

const S3 = new AWS.S3({
    ...config,
    credentials:
        {
            accessKeyId:liara_access_key,
            secretAccessKey:liara_secert_key,
        }
});

const s3 = new S3Client({
    endpoint:liara_endpoint,
    region:'defualt',
    bucketEndpoint:true,
    credentials:{
        accessKeyId:liara_access_key,
        secretAccessKey:liara_secert_key,
    }
});
let upload = multer({
    storage: multerS3({
        s3:S3 as any,
        bucket:liara_bucket_name + "/logo",
        key:function(req,file,cb){
            file.originalname =
                `${Date.now()}-${Math.floor((Math.random() *100000))}-${file.originalname}` ;
            cb(null, file.originalname);
        }
    }),
});


router
    .route('/rest/logo')
    .post(
        auth.authOwner,
        uploader('/restaurant/logo').single('logo'),
        controller.changeLogo
    );

router
    .route('/rest/banner')
    .post(
        auth.authOwner,
        uploader('/restaurant/banner').single('banner'),
        controller.changeBanner,
    );

router
    .route('/preview')
    .post(
        controller.preview,
    );

router
    .route('/product/image')
    .post(
        auth.authOwner,
        uploader('/product/image').single('image'),
        controller.changeProductImage,
    );

export default router;