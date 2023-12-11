// Import the 'mongoose' library for MongoDB connection
import mongoose from "mongoose";

// Define an asynchronous function to connect to MongoDB
const connectDB = async () => {
  try {
    // Use the 'mongoose' library to connect to MongoDB using the provided URL
    await mongoose.connect(process.env.MONGO_URL);

    // Log a success message if the connection is successful
    console.log("MongoDB is connected");
  } catch (error) {
    // Log an error message and exit the process if the connection fails
    console.error("MongoDB Connection failed!!! ", error.message);
    process.exit(1);
  }
};

// Export the function for connecting to MongoDB
export default connectDB;
