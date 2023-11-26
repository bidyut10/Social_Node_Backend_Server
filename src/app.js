import express from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.route.js";
import { blogRouter } from "./routes/blog.route.js";

//set up the express app
const app = express();

//set coming data
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//cookie setup
app.use(cookieParser());

//cors setup
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

app.use("/", userRouter);
app.use("/post/", blogRouter);

export { app };
