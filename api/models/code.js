import mongoose from "mongoose";
const Schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    code: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Code", Schema);