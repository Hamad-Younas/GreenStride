import mongoose from "mongoose";
const Schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    options: [
        {
          type: {
            option: Number,
            details: String,
            points: Number 
          }
        }
      ],  
  },
  { timestamps: true }
);

export default mongoose.model("Question", Schema);
