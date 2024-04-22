import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/auth.js"
import questionRoute from "./routes/addQuestion.js"
import answerRoute from "./routes/answer.js"
import taskRoute from "./routes/task.js"
import taskAnsRoute from "./routes/taskAnswer.js"


const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("errorrr",error)
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json());

app.use("/auth", authRoute);
app.use("/question", questionRoute);
app.use("/answer", answerRoute);
app.use("/task", taskRoute);
app.use("/taskResponse", taskAnsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
