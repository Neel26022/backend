import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const existingLike = await Like.findOne(
        { 
            video: videoId, 
            likedBy: req.user._id 
        }
    );
    
    if (existingLike) {
        return res
        .status(409)
        .json(
            new ApiResponse(409, "Video already liked")
        );
    }

    const videolike = await Like.create({
        video: videoId,
        likedBy: req.user._id
    });

    return res
    .status(200)
    .json(
        new ApiResponse(200, videolike, "Video liked successfully.")
    );
});


const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    const existingLike = await Like.findOne(
        { 
            comment: commentId, 
            likedBy: req.user._id 
        }
    );

    if (existingLike) {
        return res
        .status(409)
        .json(
            new ApiResponse(409, "Comment already liked")
        );
    }

    const commentlike = Like.create({
        comment: commentId,
        likedBy: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, commentlike, "Comment like successfully.")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    const existingLike = await Like.findOne(
        { 
            tweet: tweetId, 
            likedBy: req.user._id 
        }
    );

    if (existingLike) {
        return res
        .status(409)
        .json(
            new ApiResponse(409, "Tweet already liked")
        );
    }

    const tweetlike = Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweetlike, "Tweet like successfully.")
    )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like
    .find(
        { 
            likedBy: req.user._id 
        }
    )
    .populate('video');

    if (!likedVideos) {
        return res
        .status(200)
        .json(
            new ApiResponse(200, [], "No liked videos found.")
        );
    }

    const videoDetails = likedVideos.map(like => like.video);

    return res
    .status(200)
    .json(
        new ApiResponse(200, videoDetails, "Liked videos retrieved successfully.")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}