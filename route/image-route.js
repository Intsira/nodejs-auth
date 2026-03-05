const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const {uploadImage, fetchImagesController, deleteImageController} = require('../controllers/image-controller');
const uploadMiddleware = require('../middleware/upload-middleware');





//route to upload image
router.post('/upload', authMiddleware, adminMiddleware, uploadMiddleware.single('image'), uploadImage);

//route to get all the images
router.get('/', authMiddleware, fetchImagesController)

//route to delete image
router.delete('/delete/:id', authMiddleware, adminMiddleware,deleteImageController);



module.exports = router;