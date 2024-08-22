import 'multer';

declare module 'multer' {
  interface File {
    location?: string; // Add location as an optional property
  }
}