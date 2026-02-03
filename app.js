import express from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import errorHandler from './src/middlewere/errorhandle.middleware.js';
const app=express();
app.use(cors({
 origin:process.env.CORS_ORIGIN,  
  credentials: true
}));
 app.use(express.json())
 app.use(express.urlencoded());
  app.use(cors())
  app.use(express.static("public"))
app.use(cookieparser())

//   router imports
  
import userRouter from './src/routers/user.router.js';
app.use("/api/v1/user",userRouter)
// error hadle for routes
app.use(errorHandler);

export default app;