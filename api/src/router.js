const { Router } = require('express');
const { sendFile } = require('express/lib/response');
const multer = require('multer');
const path = require('path');

const router = Router();
module.exports = router;

function filename (request, file, callback) {
    callback(null, file.originalname);
}

const storage = multer.diskStorage({
    "destination": 'api/uploads/',
    "filename": filename
});

function fileFilter (request, file, callback) {
    if (file.mimetype != 'image/png') {
        request.fileValidationError = 'Wrong file type';
        callback(null, false, Error('Wrong file type'));
    } else {
        callback(null, true);
    }
}

const upload = multer({
    "fileFilter": fileFilter,
    "storage": storage
});

router.post('/upload', upload.single('photo'), (request, response) => {
    if (request.fileValidationError) {
        response.status(400).json({
            "error": request.fileValidationError
        });
    } else {
        response.status(201).json({
            'success': true
        })
    }
});

const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

router.get('/photo-viewer', (request, response) => {
    response.sendFile(photoPath);
});

