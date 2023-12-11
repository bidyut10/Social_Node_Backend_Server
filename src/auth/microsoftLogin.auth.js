// Import necessary modules and dependencies
import passport from "passport";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { UserModel } from "../models/user.model.js";
import { generate5DigitCode } from "../utils/uuidCodeGeneration.js";
import { generateRandomPassword } from "../utils/RandomPasswordGenerator.js";
import { defaultProfileImageUrl } from "../constants/user.constant.js";

// Configure Microsoft authentication strategy
const microsoftStrategy = new MicrosoftStrategy(
  {
    clientID: process.env.MICROSOFT_CLIENTID,
    clientSecret: process.env.MICROSOFT_CLIENTSECRET,
    callbackURL:
      process.env.BACKEND_URL + "/v.1.0.1/users/auth/microsoft/callback",
    scope: ["user.read"],
    tenant: "common",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user already exists
      let user = await UserModel.findOne({ email: profile.emails[0].value });

      if (user) {
        // If the user exists, return the user
        done(null, user);
      } else {
        // If the user doesn't exist, create a new user

        // Generate a unique username for the new user
        const generatedUserName =
          "@" +
          profile.displayName.split(" ")[0] +
          (await generate5DigitCode());

        // Generate a random password for the new user
        const randomPassword = await generateRandomPassword();

        // Create a new user with Microsoft profile information
        user = await UserModel.create({
          fullName: profile.displayName,
          email: profile.emails[0].value,
          userName: generatedUserName.toLowerCase(),
          password: randomPassword, // Set the generated random password
          profileImageUrl: defaultProfileImageUrl, // Use default profile image
        });

        // Generate access token for the new user
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;

        // Save the new user to the database
        await user.save();

        // Return the new user
        done(null, user);
      }
    } catch (error) {
      // Handle errors and pass them to the authentication process
      done(error);
    }
  }
);

// Use the Microsoft authentication strategy with Passport
passport.use("microsoft", microsoftStrategy);

// Export the configured Microsoft authentication strategy
export { microsoftStrategy };
