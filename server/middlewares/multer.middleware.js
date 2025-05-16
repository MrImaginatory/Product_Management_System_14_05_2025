import multer from "multer";
import path from "path";
import fs from 'fs';

const storage = multer.memoryStorage();

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
        cb(null, true);  
    } else {
        cb(new Error('Only image files are allowed'), false);  
    }
};

const upload = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 1024 * 1024 * 5 }  
});

const uploadProductImages = upload.fields([
    { name: "displayImage", maxCount: 1 },
    { name: "otherImages", maxCount: 50 },
]);

export { uploadProductImages, upload }; 