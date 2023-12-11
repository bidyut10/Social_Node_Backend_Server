import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";
import { asyncTryCatchHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const jwtLoginForUser = asyncTryCatchHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await UserModel.findOne({ email });

    // If the user doesn't exist, you can handle this scenario accordingly
    if (!user) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password is not valid, return an error
    if (!isPasswordValid) {
        return res.status(401).json(new ApiResponse(401, null, "Invalid password"));
    }

    // Generate access token for the user
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save();

    // Return the response with the user details and access token
    const response = {
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            userName: user.userName,
            profileImageUrl: user.profileImageUrl,
        },
        refreshToken,
    };

    return res.status(200).json(new ApiResponse(200, response, "Success"));
});

export { jwtLoginForUser };
