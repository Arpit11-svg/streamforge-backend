import { Tweet } from "../models/tweet.model.js";
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

    await tweet.populate("owner", "username fullname avatar");

    return res.status(201).json(
        new ApiResponse(
            201,
            tweet,
            "Tweet created successfully"
        )
    )
})

export {
    createTweet,
}