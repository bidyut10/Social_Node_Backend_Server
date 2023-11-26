import { BlogModel } from "../models/blog.model.js";
import { UserModel } from "../models/user.model.js";

const createBlog = async (req, res) => {
  try {
    const { blogTitle, blogDescription, blogImageUrl, publisherId } = req.body;

    // Check if the publisher exists
    const publisher = await UserModel.findById(publisherId);
    if (!publisher) {
      throw new Error("Publisher not found");
    }

    const newBlog = new BlogModel({
      blogTitle,
      blogDescription,
      blogImageUrl,
      publisher: publisherId,
    });

    await newBlog.save();

    console.log("Blog created successfully");
    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

export { createBlog };
