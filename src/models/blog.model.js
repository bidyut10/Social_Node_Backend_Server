import mongoose from "mongoose";
import { CommentSchema } from "./comment.model.js";

const BlogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    blogDescription: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    blogImageUrl: {
      type: String,
      trim: true,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalComments: [CommentSchema],
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Publisher is required"],
    },
    isPublished: {
      type: Boolean,
      default: true,
      enum: [true, false],
    },
  },
  { timestamps: true }
);

export const BlogModel = mongoose.model("Blog", BlogSchema);
