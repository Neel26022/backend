import mongoose from "mongoose"
import {comment} from "../models/comment.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const comments = await Comment.find({ video: videoId })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .exec();

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments retrieved successfully.")
    );

})

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { videoId } = req.params;

    if (!content) {
        throw new ApiError(400, "Content is required.");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    });

    if (!comment) {
        throw new ApiError(500, "Something went wrong while adding the comment.");
    }

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully.")
    );
});

const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!content) {
        throw new ApiError(400, "Content is required.");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    );

    if (!updatedComment) {
        throw new ApiError(500, "Something went wrong while updating the comment.");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully.")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
        throw new ApiError(500, "Something went wrong while deleting the comment.");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedComment, "Comment deleted successfully.")
    );
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }