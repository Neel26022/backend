import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.js";


export const VerifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRT);

        console.log("Decoded Token:", decodedToken); // Log decoded token for debugging
    } catch (err) {
        if (err.name === "TokenExpiredError") {
        throw new ApiError(401, "Access token expired");
    } else if (err.name === "JsonWebTokenError") {
        throw new ApiError(401, "Invalid access token");
    } else {
        throw new ApiError(401, "Could not verify token");
    }
}


const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
    
    } catch (error) {
        console.error("Error verifying JWT:", error);
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});