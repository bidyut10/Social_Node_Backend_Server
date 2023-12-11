// Import necessary modules and dependencies
import { Router } from "express";
import passport from "passport";
import {
  createUser,
  microsoftLoginCheckForUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtLoginForUser } from "../auth/jwtLogin.auth.js";

// Create an Express Router instance
const userRouter = Router();

// Route for initiating Microsoft authentication
userRouter.get("/auth/microsoft", passport.authenticate("microsoft"));

// Callback route after Microsoft authentication
userRouter.get(
  "/auth/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/" }),
  microsoftLoginCheckForUser
);

// Route for creating a new user, including file upload using multer middleware
userRouter.post("/create_user", upload.fields([
  {
    name: "profileImageUrl",
    maxCount: 1,
  },
]), createUser);

userRouter.get("/jwt_login", jwtLoginForUser)

// Export the user router for use in other parts of the application
export { userRouter };
