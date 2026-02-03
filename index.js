import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
import app from './app.js'
import connectDB from "./src/db/index.js";
connectDB().then(()=>{
    const port=process.env.PORT||3000
    app.listen(port,()=>{
         console.log("Server is running sucessfull at : ",port);
    })
})
.catch((error)=>console.log(error))

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});
