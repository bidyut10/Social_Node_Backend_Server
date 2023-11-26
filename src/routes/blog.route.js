import { Router } from "express";
import { createBlog } from "../controllers/blog.controller.js";

const blogRouter = Router();

blogRouter.post("/create_blog", createBlog);
// blogRouter.post("/send_connection_request", BlogController.connectionRequest);
// blogRouter.post("/accept_connection_request", BlogController.acceptConnection);
// blogRouter.post("/delete_connection_request", BlogController.deleteConnection);

// blogRouter.get("/get_account_details", BlogController.getAccountDetails);

export { blogRouter };
