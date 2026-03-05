const Image = require('../models/image');
const uploadToCloudinary = require('../helpers/cloudinary-helper');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');


const uploadImage = async (req, res) => {
    try {
        //check if file is missing in request
        if(!req.file){
            return res.status(400).json({
                message: 'No file uploaded',
                success: false
            });   
        }

        //upload image to cloudinary
        const {url, publicId} = await uploadToCloudinary(req.file.path);

        //store the image url and public id along with user id
        const newImage = new Image({
            url,
            publicId,
            uploadedBy: req.User.userId
        });
        await newImage.save();

        //delete the file from upload/ local storage
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            message: 'Image uploaded successfully',
            success: true,
            image: newImage
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'something went wrong, please try again',
            success: false
        });
    }
};

const fetchImagesController = async (req, res) => {
    try {

        //show image in page
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        //number of i
        const totalImages = await Image.countDocuments({});
        const totalPages = Math.ceil(totalImages / limit);

        const sortObject = {};
        sortObject[sortBy] = sortOrder;



        const images = (await Image.find().sort(sortObject).skip(skip).limit(limit)); 
        if(images){
            res.status(200).json({
                message: 'Images fetched successfully',
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data : images
            });
        }else {
            res.status(404).json({
                message: 'No images found',
                success: false
            });
        }
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: 'something went wrong please try again',
            success: false
        });
    }
};

//delete image
const deleteImageController = async (req, res) => {
    try {
        const imageId = req.params.id;
        const userId = req.User.userId;


        const image = await Image.findById(imageId);
        if(!image){
            return res.status(404).json({
                message: 'Image not found',
                success: false
            });
        }

        //check if the image was uploaded by the curent user
        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                message: 'You are not authorized to delete this image',
                success: false
            });
        }

        //delete the image from cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        //delete the image from the database
        await Image.findByIdAndDelete(imageId);

        res.status(200).json({
            message: 'Image deleted successfully',
            success: true
        });

   
    } catch (error) {
        res.status(500).json({
            message: 'something went wrong  please try again',
            success: false
        });
    }
};



module.exports = {uploadImage, fetchImagesController, deleteImageController};