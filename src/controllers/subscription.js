import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.js"
import { Subscription } from "../models/subscription.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const existingSubscription = await Subscription.findOne(
        { 
            subscriber: req.user._id, 
            channel: channelId 
        }
    );

    if (existingSubscription) {
        return res
        .status(409)
        .json(
            new ApiResponse(409, "Already channel subscribed")
        );
    }

    const subscription = Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, subscription, "subscribed successfully")
    )


})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    const subscribers = await Subscription.find(
            { 
                channel_id: channelId 
            }
        ).populate('subscriber');

    return res
    .status(200)
    .json(
         new ApiResponse(200, subscribers, "fetched channel subscribers successfully")
    );
   

});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    
    const { subscriberId  } = req.params;
        
    const channels = await Subscription.find(
        { 
            user_id: subscriberId  
        }
        ).populate('channel');

    return res
    .status(200)
    .json(
        new ApiResponse(200, channels, "fetched subscribed channel successfully")
    );
    
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}