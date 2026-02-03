import { User } from "../models/users.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.accessToken ||
    (authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null);
      console.log("access token :", token)
  if (!token) {
    throw new ApiError(401, "Access token missing");
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new ApiError(500, "JWT secret not configured");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, err.message || "Invalid access token");
  }

  const user = await User.findById(decodedToken._id)
    .select("-password -refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }
  console.log(user);
  req.user = user;
  next();
});
