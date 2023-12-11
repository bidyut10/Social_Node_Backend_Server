import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { microsoftStrategy } from "./auth/microsoftLogin.auth.js";
import { UserModel } from "./models/user.model.js";
import { userRouter } from "./routes/user.route.js";
import cors from 'cors'


//set up the express app
const app = express();

//set coming data
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

//cookie setup
app.use(cookieParser());

// cors setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);


// Set up session middleware with specified options
app.use(
    session({
        secret: process.env.MICROSOFT_SECRECTKEY, // Secret key for session encryption
        resave: false, // Do not save session data on every request
        saveUninitialized: true, // Save uninitialized sessions
        debug: true, // Enable session debugging
    })
);

// Initialize Passport and set up session support
app.use(passport.initialize());
app.use(passport.session());

// Serialize user information to store in the session
passport.serializeUser((user, done) => {
    done(null, user._id); // Serialize user by storing their _id in the session
});

// Deserialize user from the session based on the stored _id
passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id); // Retrieve user information based on _id
    done(null, user); // Pass the user to the next middleware or route handler
});

// Use the configured Microsoft authentication strategy with Passport
passport.use("microsoft", microsoftStrategy);


app.use("/api/v.1.0.1/users", userRouter);

export { app };
