// Import necessary libraries and modules
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the schema for the User model
const UserSchema = new mongoose.Schema(
  {
    // Unique username for the user
    userName: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    // Full name of the user (required)
    fullName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    // Phone number of the user (unique)
    phone: {
      type: Number,
      unique: [true, "Phone Number is already present"],
      trim: true,
    },
    // Email address of the user (required and unique)
    email: {
      type: String,
      required: [true, "Email Id is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    // Password for user authentication (required, min length: 8 characters)
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: 8,
    },
    // URL for the user's profile image
    profileImageUrl: {
      type: String,
      trim: true,
    },
    // Access token for user authentication
    accessToken: {
      type: String,
      trim: true,
    },
    // Refresh token for user authentication
    refreshToken: {
      type: String,
      trim: true,
    },
    // List of connection requests from other users
    connectionRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // List of user connections
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true } // Enable automatic timestamps for created and updated fields
);

// Middleware to hash the user's password before saving to the database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if the provided password is correct
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate an access token for user authentication
UserSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate a refresh token for user authentication
UserSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Create and export the User model using the defined schema
export const UserModel = mongoose.model("User", UserSchema);
