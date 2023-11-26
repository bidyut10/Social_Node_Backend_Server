import { UserModel } from "../models/user.model.js";
import { generate5DigitCode } from "../utils/uuidCodeGeneration.js";
import { asyncTryCatchHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
  const defaultProfileImageUrl = "New image";

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

const connectionRequest = async (req, res) => {
  const { senderId, receiverId } = req.query;

  try {
    const sender = await UserModel.findById(senderId);
    if (!sender) {
      throw new Error("Sender user not found");
    }

    const receiver = await UserModel.findById(receiverId);
    if (!receiver) {
      throw new Error("Receiver user not found");
    }

    // Check if the sender is already in the receiver's connections or connection requests
    if (
      receiver.connections.includes(sender._id) ||
      receiver.connectionRequests.includes(sender._id)
    ) {
      throw new Error(
        "Connection request already sent or user is already connected"
      );
    }

    // Add the sender to the receiver's connection requests
    receiver.connectionRequests.push(sender._id);
    await receiver.save();

    console.log("Connection request sent successfully");
    res.status(200).json({ message: "Connection request sent successfully" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const acceptConnection = async (req, res) => {
  const { userId, connectionId } = req.query;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const connectionUser = await UserModel.findById(connectionId);
    if (!connectionUser) {
      throw new Error("Connection user not found");
    }

    // Check if the connectionId exists in the connectionRequests array
    if (!user.connectionRequests.includes(connectionId)) {
      throw new Error("Connection request not found");
    }

    // Add the connection to the user's connections array
    user.connections.push(connectionId);

    // Remove the connection from the connectionRequests array
    user.connectionRequests = user.connectionRequests.filter(
      (requestId) => requestId.toString() !== connectionId.toString()
    );

    // Add the user to the connectionId's connections array
    connectionUser.connections.push(userId);
    await connectionUser.save();

    await user.save();

    console.log("Connection request accepted successfully");
    res
      .status(200)
      .json({ message: "Connection request accepted successfully" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const deleteConnection = async (req, res) => {
  const { userId, connectionId } = req.query;

  try {
    const user = await UserModel.findById(userId);
    const connectionUser = await UserModel.findById(connectionId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if the connectionId exists in the connectionRequests array
    if (user.connectionRequests.includes(connectionId)) {
      // Remove the connection from the connectionRequests array
      user.connectionRequests = user.connectionRequests.filter(
        (requestId) => requestId.toString() !== connectionId.toString()
      );
    }

    // Check if the connectionId exists in the connections array
    if (user.connections.includes(connectionId)) {
      // Remove the connection from the connections array
      user.connections = user.connections.filter(
        (connection) => connection.toString() !== connectionId.toString()
      );
    }
    // Check if the userId exists in the connections array
    if (connectionUser.connections.includes(userId)) {
      // Remove the connection from the connections array
      connectionUser.connections = connectionUser.connections.filter(
        (connection) => connection.toString() !== userId.toString()
      );
    }

    await user.save();
    await connectionUser.save();

    console.log("Connection request deleted successfully");
    res
      .status(200)
      .json({ message: "Connection request deleted successfully" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

const getAccountDetails = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await UserModel.findById(userId)
      .populate("connections", "_id userName fullName")
      .populate("connectionRequests", "_id userName fullName");
    if (!user) {
      throw new Error("User not found");
    }

    // Extract specific details
    const userDetails = {
      userName: user.userName,
      fullName: user.fullName,
      connections: user.connections.map((connection) => ({
        _id: connection._id,
        userName: connection.userName,
        fullName: connection.fullName,
      })),
      connectionRequests: user.connectionRequests.map((request) => ({
        _id: request._id,
        userName: request.userName,
        fullName: request.fullName,
      })),
    };

    res.status(200).json(userDetails);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export {
  createUser,
  connectionRequest,
  acceptConnection,
  deleteConnection,
  getAccountDetails,
};
