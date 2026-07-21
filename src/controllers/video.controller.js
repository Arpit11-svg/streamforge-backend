import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

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
                    $option: "i", //ignore lower/uppercase
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

    if (!req.user || !req.user._id.equals(userId)) {
        match.isPublished = true;
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

    const isOwner =
        req.user && video.owner.equals(req.user._id);

    if (!video.isPublished && !isOwner) {
        throw new ApiError(403, "Video is not published");
    }

    const existing = await User.findOne({
        _id: req.user._id,
        "watchHistory.video": videoId,
    })

    if (existing) {
        await User.updateOne(
            {
                _id: req.user._id,
                "watchHistory.video": videoId,
            },
            {
                $set: {
                    "watchHistory.$.watchedAt": new Date()
                }
            }
        );
    }
    else {
        await Video.findByIdAndUpdate(videoId, {
            $inc: {
                views: 1
            }
        });

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $push: {
                    watchHistory: {
                        video: videoId,
                        watchedAt: new Date()
                    }
                },
            }
        );
    }

    const video = await Video.findById(videoId)
        .populate("owner", "username fullName avatar");

    if (!video) {
        throw new ApiError(400, "Video not found for given videoId")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video fetched successfully")
        )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId?.trim()) {
        throw new ApiError(400, "videoId is missing");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!video.owner.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    await deleteFromCloudinary(video.videoFile.public_id);
    await deleteFromCloudinary(video.thumbnail.public_id);

    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId?.trim()) {
        throw new ApiError(400, "videoId is missing");
    }

    let video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!video.owner.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    let { title, description } = req.body;

    if (!title || title.trim() === "") {
        title = video.title;
    }
    if (!description || description.trim() === "") {
        description = video.description;
    }

    const thumbnailLocalPath = req.file?.path;

    let updatedThumbnail = video.thumbnail;

    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnail?.secure_url) {
            throw new ApiError(500, "Something went wrong while uploading thumbnail to cloudinary");
        }

        await deleteFromCloudinary(video.thumbnail.public_id);

        updatedThumbnail = {
            url: thumbnail.secure_url,
            public_id: thumbnail.public_id,
        };
    }

    video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: updatedThumbnail,
            },
        },
        {
            new: true,
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video gitupdated successfully")
        )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId?.trim()) {
        throw new ApiError(400, "Video ID is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (!video.owner.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to toggle the status of this video");
    }

    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            `Video ${video.isPublished ? "published" : "unpublished"} successfully`
        )
    );
});

export {
    publishVideo,
    getAllVideos,
    getVideoById,
    deleteVideo,
    updateVideo,
    togglePublishStatus,
}