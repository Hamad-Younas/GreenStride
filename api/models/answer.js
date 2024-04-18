import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Define the marks schema
const marksSchema = new Schema({
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    obtainPoints: { type: Number, required: true }
}, { _id: false }); // Prevents the generation of an _id field for marks

// Define the Answer schema
const answerSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    marks: [marksSchema] // Array of marks objects
  },
  { timestamps: true }
);

export default mongoose.model("Answer", answerSchema);