import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB is connected");
  } catch (error) {
    console.error("MongoDB Connection failed!!! ", error.message);
    process.exit(1);
  }
};

export default connectDB;
