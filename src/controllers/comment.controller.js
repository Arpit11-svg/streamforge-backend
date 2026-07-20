import { ApiError } from "../utils/ApiError";
import { Comment } from "../models/comment.model";
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

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (!comment.owner.equals(req.user._id)) {
        throw new ApiError(403, "You are unauthorized to delete this comment");
    }

    await comment.deleteOne();
    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
})

const updateComment = asyncHandler(async (req, res) => {
    let { content } = req.body
    const { commentId } = req.params

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (!comment.owner.equals(req.user._id)) {
        throw new ApiError(403, "You are unauthorized to update this comment");
    }

    if (!content || content.trim() === "") {
        content = comment.content
    }

    comment.content = content.trim()
    await comment.save();
    return res.status(200).json(
        new ApiResponse(
            200,
            comment,
            "Comment updated successfully"
        )
    );
})

export {
    addComment,
    deleteComment,
    updateComment,
}