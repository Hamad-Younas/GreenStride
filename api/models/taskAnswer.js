import mongoose from "mongoose";
const Schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    date: {
      type: Date,
      required: true
    },
    reward: {
      type: Number,
    },
    res: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("TaskResponse", Schema);