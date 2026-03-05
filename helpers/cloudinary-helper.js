const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {

    try {
        const result = await cloudinary.uploader.upload(filePath);
        return {
            publicId: result.public_id, 
            url: result.secure_url
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
};

module.exports = uploadToCloudinary;