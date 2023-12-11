// Import the Cloudinary library and the file system module
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with API credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Define an asynchronous function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Check if the local file path is provided
    if (!localFilePath) return null;

    // Upload the file to Cloudinary and specify resource type as "auto"
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Log a success message with the Cloudinary URL of the uploaded file
    console.log("File is Uploaded on Cloudinary ", response.url);

    // Return the Cloudinary response
    return response;
  } catch (error) {
    // If file upload fails, remove the locally saved temporary file
    fs.unlinkSync(localFilePath);

    // Return null to indicate the failure of the file upload
    return null;
  }
};

// Export the function for uploading files to Cloudinary
export { uploadOnCloudinary };
