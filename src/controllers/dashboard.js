import mongoose from "mongoose"
import {Video} from "../models/video.js"
import {Subscription} from "../models/subscription.js"
import {Like} from "../models/like.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    

})

const getChannelVideos = asyncHandler(async (req, res) => {

    const { ownerId } = req.params

    const videos = await Video.find({ owner: ownerId });

    if (!videos) {
        return res.status(200).json(
            new ApiResponse(200, [], "No videos found for this channel")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
})

export {
    getChannelStats, 
    getChannelVideos
    }