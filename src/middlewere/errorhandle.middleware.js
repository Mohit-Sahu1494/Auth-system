// middlewares/error.middleware.js
const errorHandler = (err, req, res, next) => {
//    console.log(err)
  let statusCode = err.statusCode || 400;
  let message = err.message;

  // 🔴 Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map(e => e.message)
      .join(", ");
  }

  // 🔴 Duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = "User already exists";
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

export default errorHandler;
