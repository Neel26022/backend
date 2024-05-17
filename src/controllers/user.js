import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    // get user details form frontend
    // validation - not empty
    // check if user aldery exists : username, email
    // check for image, check for avetar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from respnose
    // check for user creation
    // return res

    
    const { fullName, email, username, password } = req.body;
    console.log("email", email);

    // Check for required fields
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Get file paths
    const avatarFile = req.files?.avatar?.[0];
    const coverImageFile = req.files?.coverImage?.[0];

    if (!avatarFile) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatarLocalPath = avatarFile.path;
    console.log(`Avatar file path: ${avatarLocalPath}`);

    let coverLocalPath = "";
    if (coverImageFile) {
        coverLocalPath = coverImageFile.path;
        console.log(`Cover image file path: ${coverLocalPath}`);
    } else {
        console.log("Cover image file not uploaded or invalid.");
    }

    // Upload files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    let coverImage = null;

    if (coverLocalPath) {
        coverImage = await uploadOnCloudinary(coverLocalPath);
    }

    if (!avatar) {
        throw new ApiError(400, "Failed to upload avatar file");
    }

    // Create user object
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // Fetch the created user and exclude sensitive fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

export { registerUser };
