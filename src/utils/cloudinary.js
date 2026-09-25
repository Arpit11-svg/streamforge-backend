import { v2 as cloudinary } from 'cloudinary'
import { deleteLocalFile } from './deleteLocalFile.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        return response;

    } catch (error) {
        return null;
    }
    finally {
        deleteLocalFile(localFilePath);
    }
}

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) return null;
        await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

    } catch (error) {
        return error.message;
    }
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary,
};