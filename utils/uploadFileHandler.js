// uploadFileHandler.js
import multer from "multer";
import path from 'path';

const FILE_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValidFormat = FILE_TYPE[file.mimetype];
        let uploadError = new Error("Format file tidak valid, gunakan jpg/jpeg/png");

        if (!isValidFormat) {
            cb(uploadError, null);
        } else {
            cb(null, 'public/uploads');
        }
    },
    filename: function (req, file, cb) {
        const fileName = file.fieldname;
        const extension = FILE_TYPE[file.mimetype];
        const uniqueFile = `${fileName}-${Date.now()}.${extension}`;
        cb(null, uniqueFile);
    }
});

const fileFilter = (req, file, cb) => {
    if (FILE_TYPE[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error("Format file tidak valid, gunakan jpg/jpeg/png"), false);
    }
};

export const uploadImage = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});