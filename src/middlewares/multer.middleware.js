// Import the multer library for handling file uploads
import multer from "multer";

// Configure multer storage settings
const storage = multer.diskStorage({
  // Set the destination directory for storing uploaded files
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  // Set the filename for the uploaded file
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Create a multer upload instance with the configured storage settings
export const upload = multer({
  storage,
});
