import multerS3 from 'multer-s3';
import multer from 'multer';
import AWS from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';

// Load environment variables
const {
    LIARA_ENDPOINT: liaraEndpoint,
    LIARA_BUCKET_NAME: liaraBucketName,
    LIARA_ACCESS_KEY: liaraAccessKey,
    LIARA_SECRET_KEY: liaraSecretKey,
} = process.env;

// AWS S3 configuration for the older AWS SDK
const awsS3Config = {
    endpoint: liaraEndpoint,
    accessKeyId: liaraAccessKey,
    secretAccessKey: liaraSecretKey,
    region: 'default',
};

// Initialize the S3 instance using the older AWS SDK
const s3Instance = new AWS.S3({
    ...awsS3Config,
    credentials: {
        accessKeyId: liaraAccessKey,
        secretAccessKey: liaraSecretKey,
    },
});

// Function to create a multer uploader with S3 storage
export default function uploader(href: string) {
    return multer({
        storage: multerS3({
            s3: s3Instance as any,  // Using the S3 instance from the older SDK
            bucket: `${liaraBucketName}${href}`, // Dynamically set the bucket name
            key: (req, file, cb) => {
                // Generate a unique filename with a timestamp and random number
                file.originalname = `${Date.now()}-${Math.floor(Math.random() * 100000)}-${file.originalname}`;
                cb(null, file.originalname);
            }
        }),
    });
}
