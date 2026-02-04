import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/');
    },
    filename: function (req, file, callback) {

        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
    }
})

const fileFilter = (req, file, callback) => {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
})

export default upload;