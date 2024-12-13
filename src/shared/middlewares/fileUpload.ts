/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import multer, { FileFilterCallback } from 'multer';
import { Request, Express } from 'express';

export type TFileSchema = {
    fieldname: string; // The field name in the form (e.g., 'media')
    originalname: string; // Original file name (e.g., 'competitive_programming_handbook.pdf')
    encoding: string; // Encoding type (e.g., '7bit')
    mimetype: string; // MIME type of the file (e.g., 'application/pdf')
    buffer: Buffer; // File content as a Buffer
    size: number; // File size in bytes (e.g., 1099959)
};

export const fileTypes: string[] = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
    // Videos
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo', // AVI
    'video/x-matroska', // MKV
    // Audio
    'audio/mpeg', // MP3
    'audio/ogg',
    'audio/wav',
    'audio/webm',
    'audio/x-wav',
    'audio/x-aac', // AAC
    // PDF
    'application/pdf', // Allow PDF files
];

// Define a type-safe file filter function
const genericFileFilter = (req: Request, file: TFileSchema, cb: FileFilterCallback) => {
    if (fileTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only images, videos, audio, and PDF files are allowed!')); // Reject the file
    }
};

// Explicitly define `storage` type
const storage: multer.StorageEngine = multer.memoryStorage();

export const upload: multer.Multer = multer({
    storage,
    fileFilter: genericFileFilter,
});
