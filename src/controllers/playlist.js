import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    if (!(name && description)) {
        throw new ApiError(400, "Name and description is required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, playlist, "Successfully created playlist")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists

    const userPlaylists = await Playlist.find({
        owner: userId
    })

    if (userPlaylists.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No playlists found for this user")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, userPlaylists, "User playlists fetched successfully")
    );

   
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        return res.status(404).json(
            new ApiResponse(404, null, "Playlist not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    );
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
         return res.status(404).json(
             new ApiResponse(404, null, "Playlist not found")
        );
    }

    if (playlist.videos.includes(videoId)) {
        return res.status(200).json(
            new ApiResponse(200, null, "Video already exists in the playlist")
        );
    }

    const addvideoinplaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: {
            videos: videoId
            }
        },
        {
            new: true
        }
    )

    if (!addvideoinplaylist) {
        return res.status(404).json(
            new ApiResponse(404, null, "Playlist not found")
        );
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, addvideoinplaylist, "Video added in playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json(
                new ApiResponse(404, null, "Playlist not found")
            );
        }

        if (!playlist.videos.includes(videoId)) {
            return res.status(200).json(
                new ApiResponse(200, null, "Video does not exist in the playlist")
            );
        }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId
            }
            },
            {
                new: true
            }
        );

    if (!updatedPlaylist) {
        return res.status(404).json(
            new ApiResponse(404, null, "Playlist not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully")
    );

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    const playlist = await Playlist.findById(playlistId);
    
    if (playlist == null) {
        throw new ApiError(400, "Playlist not found")
    }

    const deleteplaylist = await Playlist.findByIdAndDelete(playlistId)

    

    return res
    .status(200)
    .json(
        new ApiResponse(200, deleteplaylist, "Playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!(name && description)) {
        throw new ApiError(400, "Name and description filed are required")
    }

    const updateplaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updateplaylist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}