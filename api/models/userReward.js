import mongoose from "mongoose";

// Define the sub-schema for codes
const codeSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward' , required: true },
    code: { type: String, required: true },
    exp: { type: Boolean, required: true }
}, { _id: false });

// Define the main schema for UserReward
const userRewardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rewards: [codeSchema] // Using the previously defined sub-schema
}, { timestamps: true });

export default mongoose.model("UserReward", userRewardSchema);
