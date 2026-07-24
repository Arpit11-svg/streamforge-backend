import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Tweet } from "../models/tweet.model.js";

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

const getChannelStats = asyncHandler(async (req, res) => {

    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [
        subscribersCount,
        subscribedCount,
        videoCount,
        likesGiven,
        commentsMade,
        totalLikes,
        totalComments,
        totalViews,
        myPlaylistCount,
        myTweetCount
    ] = await Promise.all([

        Subscription.countDocuments({
            channel: userId
        }),

        Subscription.countDocuments({
            subscriber: userId
        }),

        Video.countDocuments({
            owner: userId
        }),

        Like.countDocuments({
            likedBy: userId,
            video: {
                $exists: true,
                $ne: null
            }
        }),

        Comment.countDocuments({
            owner: userId
        }),

        Video.aggregate([
            {
                $match: {
                    owner: userId
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "videoLikes"
                }
            },
            {
                $project: {
                    likeCount: {
                        $size: "$videoLikes"
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalLikes: {
                        $sum: "$likeCount"
                    }
                }
            }
        ]),

        Comment.aggregate([
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "video"
                }
            },
            {
                $unwind: "$video"
            },
            {
                $match: {
                    "video.owner": userId
                }
            },
            {
                $count: "totalComments"
            }
        ]),

        Video.aggregate([
            {
                $match: {
                    owner: userId
                }
            },
            {
                $group: {
                    _id: null,
                    totalViews: {
                        $sum: "$views"
                    }
                }
            }
        ]),

        Playlist.countDocuments({
            owner: userId
        }),

        Tweet.countDocuments({
            owner: userId
        })
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                channel: {
                    subscribers: subscribersCount,
                    subscribed: subscribedCount,
                    videos: videoCount,
                    playlists: myPlaylistCount,
                    tweets: myTweetCount
                },
                engagement: {
                    totalViews: totalViews[0]?.totalViews || 0,
                    totalLikes: totalLikes[0]?.totalLikes || 0,
                    totalComments: totalComments[0]?.totalComments || 0
                },
                activity: {
                    likesGiven,
                    commentsMade
                }
            },
            "Channel stats fetched successfully"
        )
    );
});

export {
    getChannelVideos,
    getChannelStats,
}