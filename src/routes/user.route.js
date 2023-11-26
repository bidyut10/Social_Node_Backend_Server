import { Router } from "express";
import {
  createUser,
  connectionRequest,
  acceptConnection,
  deleteConnection,
  getAccountDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.post("/create_user", upload.fields([
  {
    name: "profileImageUrl",
    maxCount: 1,
  },
]), createUser );
// userRouter.post("/send_connection_request", connectionRequest);
// userRouter.post("/accept_connection_request", acceptConnection);
// userRouter.post("/delete_connection_request", deleteConnection);

// userRouter.get("/get_account_details", getAccountDetails);

export { userRouter };
