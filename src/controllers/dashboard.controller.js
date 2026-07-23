import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getChannelVideos = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const channelVideos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "comments"
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes"
                },
                commentsCount: {
                    $size: "$comments"
                }
            }
        },
        {
            $project: {
                likes: 0,
                comments: 0
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: Number(skip)
        },
        {
            $limit: Number(limit)
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            channelVideos,
            "Channel videos fetched successfully"
        )
    )
})

export {
    getChannelVideos,
}