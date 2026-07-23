import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if ([name, description].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "Name and description of playlist are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        videos: [],
    })

    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            playlist,
            "Playlist created successfully"
        )
    );
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (
        !mongoose.Types.ObjectId.isValid(playlistId) ||
        !mongoose.Types.ObjectId.isValid(videoId)
    ) {
        throw new ApiError(400, "Invalid id");
    }

    let playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found to add in a playlist")
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to modify this playlist")
    }

    const alreadyExists = playlist.videos.some(
        id => id.toString() === videoId
    );
    if (alreadyExists) {
        throw new ApiError(400, "Video already exists in playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Video added to playlist successfully"
        )
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to delete this playlist")
    }

    await playlist.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Playlist deleted successfully"
        )
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    let playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to update this playlist")
    }

    const updateFields = {};

    if (name?.trim()) {
        updateFields.name = name.trim();
    }

    if (description?.trim()) {
        updateFields.description = description.trim();
    }

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "Provide at least one field to update");
    }

    playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: updateFields
        },
        {
            returnDocument: "after",
            runValidators: true,
        }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Playlist updated successfully"
        )
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    const playlist = await Playlist.findById(playlistId).populate("videos").populate("owner", "username fullName avatar");

    if (!playlist) {
        throw new ApiError(404, "PlayList not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "PlayList fetched successfuly"
        )
    )

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const playlists = await Playlist.aggregate([
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
            $addFields: {
                videoCount: {
                    $size: "$videos"
                },
                firstVideo: {
                    $arrayElemAt: ["$videos", 0]
                }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "firstVideo",
                foreignField: "_id",
                as: "thumbnailVideo",
            }
        },
        {
            $addFields: {
                thumbnail: {
                    $arrayElemAt: ["$thumbnailVideo.thumbnail", 0]
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                videoCount: 1,
                thumbnail: 1,
                createdAt: 1,
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                playlists,
                totalPlaylists: playlists.length
            },
            "Playlists fetched successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to modify this playlist");
    }

    const videoExists = playlist.videos.some(id => id.equals(videoId));

    if (!videoExists) {
        throw new ApiError(404, "Video not found in playlist");
    }

    playlist.videos.remove(videoId);

    await playlist.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Video removed from playlist successfully"
        )
    )
})

export {
    createPlaylist,
    addVideoToPlaylist,
    deletePlaylist,
    updatePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
}