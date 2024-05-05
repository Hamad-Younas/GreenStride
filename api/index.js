import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import cors from "cors";

import authRoute from "./routes/auth.js"
import questionRoute from "./routes/addQuestion.js"
import answerRoute from "./routes/answer.js"
import taskRoute from "./routes/task.js"
import taskAnsRoute from "./routes/taskAnswer.js"
import rewardRoute from "./routes/reward.js"
import userRewardRoute from "./routes/userReward.js"
import mailRoute from "./routes/mail.js"



const app = express();
dotenv.config();


const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://greenstrideservice:admin123@cluster0.niqaym5.mongodb.net/GreenStride");
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("errorrr", error)
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
app.use(bodyParser.json());

app.use("/auth", authRoute);
app.use("/question", questionRoute);
app.use("/answer", answerRoute);
app.use("/task", taskRoute);
app.use("/taskResponse", taskAnsRoute);
app.use("/reward", rewardRoute);
app.use("/userReward", userRewardRoute);
app.use("/mail", mailRoute);

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