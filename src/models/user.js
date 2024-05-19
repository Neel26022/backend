import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userShema = new Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
            lowecase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        fullName: {
            type: String,
            require: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary url
            require: true,
        },
        coverImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            require: [true,"Password is required"],
        },
        refreshToken: {
            type: String,
        }
    },
        {
            timestamps: true
        }
)

userShema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password,  10)
    next()
})

userShema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userShema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRT,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userShema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRT,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userShema)