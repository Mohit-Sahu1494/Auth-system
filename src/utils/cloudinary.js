import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./apiError.js";
import fs from "fs";

const key = process.env.CLOUDINARY_API_KEY
    
// cloudinary.config({
//   cloud_name:"dx80hgxo3",
//   api_key: key,
//   api_secret:"f6zWInkmv6b1MvvGE9V-NHBTFds"
// });
const uploadOnCloudinary = async (localFilePath) => {
     console.log(process.env.CLOUDINARY_NAME)
      console.log("Api key",process.env.CLOUDINARY_API_KEY)
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
    //   fs.unlinkSync(localFilePath);
    }
    console.log(error)
  }
};

export { uploadOnCloudinary };
