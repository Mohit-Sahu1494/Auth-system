import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/users.models.js";
import {ApiResponse} from '../utils/apiResponse.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";





// genertage access token

const generateAccessandRefreshToken=async(user_id)=>{
try {
    if (!user_id) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(user_id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken(); // ✅ spelling fixed

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

} catch (error) {
    throw new ApiError(
        error.statusCode || 500,
        error.message || "Something went wrong, try again later"
    );
}

}


// register page backend

const register = asyncHandler(async (req, res) => {

  const { name, username, email, phone, password } = req.body;

  // 1️⃣ Required fields check
  if ([name, username, email, phone, password].some(
    field => !field || field.trim() === ""
  )) {
    throw new ApiError(400, "Please fill all required fields");
  }

  // 2️⃣ Check existing user
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  const avatarlocalpath  = "public/User_dp/wp9280849.jpg";
      const avatar = await uploadOnCloudinary(avatarlocalpath);
      if(!avatar){
           throw new ApiError(500, "internal server error");
      }

  // 3️⃣ Create user (validation + hashing auto hoga)
  const user = await User.create({
    name,
    username,
    email,
    phone,
    password,
    avatar:avatar.secure_url,
  });

  // 4️⃣ Final response (password remove)
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone
    }
  });
});


// login page design
const login = asyncHandler(async (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  if (!username && !email && !phone) {
    throw new ApiError(400, "Username, email or phone is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }, { phone }]
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessandRefreshToken(user._id);
 
  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken");
const Options = {
  httpOnly: true,
  secure: false,
  sameSite: "lax"
};

  return res
    .status(200)
    .cookie("accessToken", accessToken, Options)
    .cookie("refreshToken", refreshToken,Options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser ,
            accessToken:refreshToken
        },
        "User logged in successfully"
      )
    );
});



// logout

const logoutUser=asyncHandler(async(req,res)=>{
    // clear all cookies 
    console.log("user Id :- ", req.user._id)
   const user=await User.findByIdAndUpdate(
        req.user._id,
        {
             $unset: { refreshToken: 1 }
        },{
            new:true
        }
    )
    console.log("updated user :- ", user)
     const options={
    httpOnly:true,
    secure:true
   }
   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"user logout sucessfull"))

})


// incomming refresh token

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id);
  if (!user || incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } =
    await generateAccessandRefreshToken(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, {}, "Access token refreshed")
    );
});

export { register ,login,logoutUser};
