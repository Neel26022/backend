import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.js"
import {User} from "../models/user.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    const videoFile = req.files?.videoFile?.[0];
    if (!videoFile) {
        throw new ApiError(400, "Video file is required.");
    }

    const videoLocalPath = videoFile.path;
    console.log('Video Local Path:', videoLocalPath);
    const video = await uploadOnCloudinary(videoLocalPath);
    console.log('Uploaded Video:', video);

    if (!video) {
        throw new ApiError(500, "Failed to upload video file.");
    }

    const thumbnailFile = req.files?.thumbnail?.[0];
    if (!thumbnailFile) {
        throw new ApiError(400, "Thumbnail file is required.");
    }

    const thumbnailLocalPath = thumbnailFile.path;
    console.log('Thumbnail Local Path:', thumbnailLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    console.log('Uploaded Thumbnail:', thumbnail);

    if (!thumbnail) {
        throw new ApiError(500, "Failed to upload thumbnail file.");
    }

    const duration = video.duration;
    console.log('Video Duration:', duration);

    if (!duration) {
        throw new ApiError(500, "Failed to retrieve video duration.");
    }

    const publishVideo = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        duration,
        views: 0,
        owner: req.user._id
    });

    if (!publishVideo) {
        throw new ApiError(500, "Failed to create the video.");
    }

    return res.status(201).json(
        new ApiResponse(201, publishVideo, "Video published successfully.")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video retrieved successfully.")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!(title && description)) {
        throw new ApiError(400, "Title and description are required.");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    const thumbnailLocalPath = req.file?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is missing.");
    }

    const oldImageCloudinaryPath = video.thumbnail;

    if (oldImageCloudinaryPath) {
        try {
            await deleteOnCloudinary(oldImageCloudinaryPath);
        } catch (error) {
            console.error("Error deleting old thumbnail:", error);
            throw new ApiError(500, "Error deleting old thumbnail.");
        }
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail.url
            }
        },
        {
            new: true
        }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully.")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video deleted successfully.")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found.");
    }

    const newPublishStatus = !video.isPublished;

    const changedPublishStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: newPublishStatus
            }
        },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, changedPublishStatus, `Publish status changed to ${newPublishStatus ? 'published' : 'unpublished'}.`)
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}