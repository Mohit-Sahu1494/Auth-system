import mongoose from "mongoose";
import bycrpt from 'bcryptjs'
import jwt from 'jsonwebtoken' 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
  },

  username: {
    type: String,
    lowercase: true,
    required: true,
    unique:true,
    index:true,
    trim:true
  },

  email: {
    type: String,
    required: true,
    index:true,
    trim:true
  },

  phone: {
    type: String,
    required: true,
     index:true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number & special character"
    ]
  },
   refreshToken: {
    type: String,
  },
  avatar: String
},{timestamps:true});

// password save hone se pahle hash me convert hoga
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bycrpt.hash(this.password, 10)
   
});

// password compare mathord
userSchema.methods.comparePassword = async function (password) {
  return await bycrpt.compare(password, this.password);
};

// generate refresh token
userSchema.methods.generateRefreshToken =  function () {
    return  jwt.sign({
    _id:this._id,
   },
   process.env.REFRESH_TOKEN_SECRET,
   {
    expiresIn:process.env.REFRESH_EXPIRY
   }
)
};

// generate access token
userSchema.methods.generateAccessToken = function () {
   return  jwt.sign({
    _id:this._id,
    email:this.email,
    phone:this.phone,
    username:this.username,
    name:this.name
   },
   process.env.ACCESS_TOKEN_SECRET,
   {
    expiresIn:process.env.ACCESS_EXPIRY 
   }
)
};


export const User=mongoose.model("User",userSchema);

