import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const videoLiked = await Like.findOne({
        likedBy: req.user._id,
        video: videoId
    });

    if (!videoLiked) {
        await Like.create({
            likedBy: req.user._id,
            video: videoId
        })
    }
    else {
        await Like.findOneAndDelete({
            likedBy: req.user._id,
            video: videoId
        })
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            `${videoLiked ? "Video unliked successfully" : "Video liked successfully"}`
        )
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const commentLiked = await Like.findOne({
        likedBy: req.user._id,
        comment: commentId
    })

    if (!commentLiked) {
        await Like.create({
            likedBy: req.user._id,
            comment: commentId
        })
    }
    else {
        await Like.findOneAndDelete({
            likedBy: req.user._id,
            comment: commentId
        })
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            `${commentLiked ? "Comment unliked successfully" : "Comment liked successfully"}`
        )
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    const tweetLiked = await Like.findOne({
        likedBy: req.user._id,
        tweet: tweetId
    })

    if (!tweetLiked) {
        await Like.create({
            likedBy: req.user._id,
            tweet: tweetId
        })
    }
    else {
        await Like.findOneAndDelete({
            likedBy: req.user._id,
            tweet: tweetId
        })
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            `${tweetLiked ? "Tweet unliked successfully" : "Tweet liked successfully"}`
        )
    )

})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
}