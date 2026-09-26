import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content for tweet is required")
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user._id
    });

    await tweet.populate("owner", "username fullName avatar");

    return res.status(201).json(
        new ApiResponse(
            201,
            tweet,
            "Tweet created successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Tweet deleted successfully"
        )
    )
})

const updateTweet = asyncHandler(async (req, res) => {

    const { content } = req.body
    const { tweetId } = req.params

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this tweet");
    }

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required for tweet")
    }

    tweet.content = content.trim()
    await tweet.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            tweet,
            "Tweet updated successfully"
        )
    )


})

const getUserTweets = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10
    } = req.query;
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
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
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner",
                }
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: Number(limit)
        },
        {
            $project: {
                content: 1,
                owner: 1,
                createdAt: 1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            tweets,
            "Tweets fetched successfully"
        )
    )
})

export {
    createTweet,
    deleteTweet,
    updateTweet,
    getUserTweets,
}