import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    if (channelId.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const channelSubscribed = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    });

    if (!channelSubscribed) {
        await Subscription.create({
            channel: channelId,
            subscriber: req.user._id
        })
    }
    else {
        await Subscription.deleteOne({
            channel: channelId,
            subscriber: req.user._id
        })
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                isSubscribed: !channelSubscribed
            },
            channelSubscribed
                ? "Channel unsubscribed successfully"
                : "Channel subscribed successfully"
        )
    );
})

const getChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
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
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
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
                subscriber: {
                    $first: "$subscriber"
                }
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribers,
            "All subscribers fetched successfully"
        )
    )
})

const getUserSubscribedChannel = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const channels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(userId)
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
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                channel: {
                    $first: "$channel"
                }
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            channels,
            "All subscribed channels fetched successfully"
        )
    )

})

export {
    toggleSubscription,
    getChannelSubscribers,
    getUserSubscribedChannel,
}