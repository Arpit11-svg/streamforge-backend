import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { videoId } = req.params;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content is required");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const comment = await Comment.create({
        content: content.trim(),
        owner: req.user._id,
        video: videoId,
    });

    const createdComment = await Comment.findById(comment._id)
        .populate("owner", "username fullname avatar");

    return res.status(201).json(
        new ApiResponse(
            201,
            createdComment,
            "Comment added successfully"
        )
    );
});

export{
    addComment,
}