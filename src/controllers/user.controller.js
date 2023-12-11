import { UserModel } from "../models/user.model.js";
import { generate5DigitCode } from "../utils/uuidCodeGeneration.js";
import { asyncTryCatchHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { defaultProfileImageUrl } from "../constants/user.constant.js";

const createUser = asyncTryCatchHandler(async (req, res) => {
  const data = req.body;
  const { fullName, phone, email } = data;

  if ([fullName, phone, email].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const firstName = fullName.split(" ")[0];
  const generatedUserName = "@" + firstName + (await generate5DigitCode());

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email Id is already exist");
  }

  let profileImageUrlLocalPath;
  if (req.files && req.files.profileImageUrl.length > 0) {
    profileImageUrlLocalPath = req.files.profileImageUrl[0].path;
  }

  const profileImageUrl = await uploadOnCloudinary(profileImageUrlLocalPath);

  // Create a new user
  const newUser = await UserModel.create({
    fullName,
    email,
    profileImageUrl: profileImageUrl?.url || defaultProfileImageUrl,
    userName: generatedUserName.toLowerCase(),
  });

  const accessToken = await newUser.generateAccessToken();
  newUser.accessToken = accessToken;

  await newUser.save();

  return res
    .status(201)
    .json(new ApiResponse(200, newUser, "User registered Successfully"));
});

const microsoftLoginCheckForUser = asyncTryCatchHandler(async (req, res) => {

  const { email } = req.user;

  // Check if the user exists in the database
  let user = await UserModel.findOne({ email });

  // If the user doesn't exist, you can handle this scenario accordingly
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
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

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Success"));
});

export { createUser, microsoftLoginCheckForUser };
