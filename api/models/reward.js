import mongoose from "mongoose";
const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        points: {
            type: Number,
            required: true,
        },
        des: {
            type: String,
            required: true,
        },
        codes: {
            type: [String],
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Reward", Schema);