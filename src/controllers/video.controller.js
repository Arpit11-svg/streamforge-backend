import mongoose from "mongoose";
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

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query

    const match = {};

    if (query) {
        match.$or = [
            {
                title: {
                    $regex: query,
                    $option: i, //ignore lower/uppercase
                },
            },
            {
                description: {
                    $regex: query,
                    $options: "i",
                },
            }
        ]
    }

    if (userId) {
        match.owner = new mongoose.Types.ObjectId(userId);
    }

    const aggregate = Video.aggregate([
        {
            $match: match,
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner",//first element of array owner
                },
            },
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1,
            },
        },
    ]);

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    const videos = await Video.aggregatePaginate(aggregate, options);

    return res.status(200).json(
        new ApiResponse(
            200,
            videos,
            "Videos fetched successfully"
        )
    );
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId?.trim()) {
        return new ApiError(
            400, "videoId is missing"
        )
    }

    const video = await Video.findById(videoId)
    .populate("owner", "username fullName avatar");

    if (video.length===0) {
        throw new ApiError(400, "Video not found for given user given videoId")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video fetched successfully")
        )

})

export {
    publishVideo,
    getAllVideos,
    getVideoById,
}