import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.js"
import {User} from "../models/user.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required.");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    });

    if (!tweet) {
        throw new ApiError(500, "Something went wrong while createing the tweet.");
    }

    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully.")
    );
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {page = 1, limit = 10} = req.query

    const tweets = await Tweet.find({ tweet: tweetId })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .exec();

    return res.status(200).json(
        new ApiResponse(200, tweets, "Tweets retrieved successfully.")
    );
})

const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { tweetId } = req.params;

    if (!content) {
        throw new ApiError(400, "Content is required.");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    );

    if (!updatedTweet) {
        throw new ApiError(500, "Something went wrong while updating the tweet.");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully.")
    );
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
        throw new ApiError(500, "Something went wrong while deleting the tweet.");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedTweet, "Tweet deleted successfully.")
    );
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}