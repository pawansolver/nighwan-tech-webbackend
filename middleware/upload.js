const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Storage Setting
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/sliders/';
        // Agar folder nahi hai toh auto-create kar dega
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Unique Name: 1710101010-image.png
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// 2. Filter: Sirf Images allowed (jpg, png, webp)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

module.exports = upload;