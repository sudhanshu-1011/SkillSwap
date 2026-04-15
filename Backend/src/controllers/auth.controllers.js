import { generateJWTToken_email, generateJWTToken_username } from "../utils/generateJWTToken.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import dotenv from "dotenv";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "../utils/SendMail.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

export const googleAuthHandler = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login`,
  session: false,
});

export const handleGoogleLoginCallback = asyncHandler(async (req, res) => {
  console.log("\n******** Inside handleGoogleLoginCallback function ********");
  // console.log("User Google Info", req.user);

  const existingUser = await User.findOne({ email: req.user._json.email });

  if (existingUser) {
  const jwtToken = generateJWTToken_username(existingUser);
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", jwtToken, { httpOnly: true, expires: expiryDate, secure: isProduction, sameSite: isProduction ? "none" : "lax" });
    return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/discover`);
  }

  let unregisteredUser = await UnRegisteredUser.findOne({ email: req.user._json.email });
  if (!unregisteredUser) {
    console.log("Creating new Unregistered User");
    unregisteredUser = await UnRegisteredUser.create({
      name: req.user._json.name,
      email: req.user._json.email,
      picture: req.user._json.picture,
    });
  }
  const jwtToken = generateJWTToken_email(unregisteredUser);
  const expiryDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessTokenRegistration", jwtToken, { httpOnly: true, expires: expiryDate, secure: isProduction, sameSite: isProduction ? "none" : "lax" });
  return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/register`);
});

export const handleLogout = (req, res) => {
  console.log("\n******** Inside handleLogout function ********");
  res.clearCookie("accessToken");
  return res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
};

// --- Standard Email/Password Auth Controllers ---

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, username, skillsProficientAt, skillsToLearn, education, bio, projects, linkedinLink, githubLink, portfolioLink } = req.body;
  
  if ([name, email, password, username].some(f => !f?.trim())) {
    throw new ApiError(400, "Name, Email, Password, and Username are required");
  }

  const existingByUsername = await User.findOne({ username });
  if (existingByUsername) {
    throw new ApiError(409, "Username is already taken. Please choose another one.");
  }

  const existingByEmail = await User.findOne({ email });
  if (existingByEmail) {
    throw new ApiError(409, "An account with this email already exists. Try logging in.");
  }


  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    username,
    password: hashedPassword,
    skillsProficientAt: skillsProficientAt || [],
    skillsToLearn: skillsToLearn || [],
    education: education || [],
    bio: bio || "",
    projects: projects || [],
    linkedinLink: linkedinLink || "",
    githubLink: githubLink || "",
    portfolioLink: portfolioLink || ""
  });

  const createdUser = await User.findById(user._id).select("-password -forgotPasswordToken -forgotPasswordTokenExpiry");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const jwtToken = generateJWTToken_username(createdUser);
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", jwtToken, { httpOnly: true, expires: expiryDate, secure: isProduction, sameSite: isProduction ? "none" : "lax" });

  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));

});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  if (!user.password) {
    throw new ApiError(400, "This account uses Google Auth. Please login with Google.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const jwtToken = generateJWTToken_username(user);
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", jwtToken, { httpOnly: true, expires: expiryDate, secure: isProduction, sameSite: isProduction ? "none" : "lax" });

  const loggedInUser = await User.findById(user._id).select("-password -forgotPasswordToken -forgotPasswordTokenExpiry");

  return res.status(200).json(new ApiResponse(200, { user: loggedInUser }, "User logged in successfully"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.forgotPasswordToken = resetToken;
  user.forgotPasswordTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
  const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;

  await sendMail(email, "Password Reset Request", message);

  return res.status(200).json(new ApiResponse(200, null, "Password reset email sent"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) throw new ApiError(400, "New password is required");

  const user = await User.findOne({
    forgotPasswordToken: token,
    forgotPasswordTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError(400, "Password reset token is invalid or has expired");
  }

  user.password = await bcrypt.hash(password, 10);
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;
  await user.save();

  return res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});
