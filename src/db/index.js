import mongoose from "mongoose";
async function connectDB() {
  try {
 const res=await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
    console.log("Database Connected Successfully ✅");
    return res;
  } catch (error) {
    console.log("mongoose error :-", error.message);
    process.exit(1);
  }
}
export default connectDB;
