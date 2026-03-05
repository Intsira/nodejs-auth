const multer = require('multer');
const path = require('path');

//set our multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'upload/');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' +Date.now() + path.extname(file.originalname));
    }
});


//file filter function
const checkFileType = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    } else {
        cb(new Error('File type not supported'));
    }
}

//multer middleware
const upload = multer({
    storage,
    fileFilter: checkFileType,
    limits: {fileSize: 1024 * 1024 * 5}//file size limits
});

module.exports = upload;