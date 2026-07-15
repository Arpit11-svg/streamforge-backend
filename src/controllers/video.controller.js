import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if ([title, description].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required")
    }
    if (req.files?.videoFile?.[0].size > 100 * 1024 * 1024) {
        throw new ApiError(400, "Video too large");
    }
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    if (!videoFile?.secure_url) {
        throw new ApiError(500, "Something went wrong while uploading video on cloudinary")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail?.secure_url) {
        await deleteFromCloudinary(videoFile.public_id)
        throw new ApiError(500, "Something went wrong while uploading thumbnail on cloudinary")
    }


    let video;
    try {
        video = await Video.create({
            title,
            description,
            videoFile: {
                url: videoFile.secure_url,
                public_id: videoFile.public_id,
            },
            thumbnail: {
                url: thumbnail.secure_url,
                public_id: thumbnail.public_id,
            },
            duration: videoFile.duration,
            owner: req.user._id,
        })

    } catch (error) {
        if (videoFile?.public_id)
            await deleteFromCloudinary(videoFile.public_id);

        if (thumbnail?.public_id)
            await deleteFromCloudinary(thumbnail.public_id);

        throw new ApiError(500, error.message)
    }

    const createdVideo = await Video.findById(video._id)
        .populate("owner", "username fullName avatar");


    return res.status(201).json(
        new ApiResponse(201, createdVideo, "Video published successfully")
    );
})

export {
    publishVideo
}