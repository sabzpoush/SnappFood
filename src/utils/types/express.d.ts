import 'express';

declare global {
    namespace Express {
        interface MulterS3File extends Multer.File {
            location: string; // Add the location property for S3 URL
        }

        export interface Request {
            file?: MulterS3File; // If you're handling a single file upload
            files?: MulterS3File[]; // If you're handling multiple file uploads
        }
    }
}