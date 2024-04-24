import Task from "../models/task.js";

export const getTaskQuestions = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Get the day of the year (1-365)
    const dayOfYear = Math.floor((currentDate - new Date(currentDate.getFullYear(), 0, 0)) / 86400000);

    // Calculate the starting index for the questions
    const startIndex = (dayOfYear - 1) % 3;

    // Get the three questions starting from the calculated index
    const task = await Task.find().skip(startIndex * 3).limit(3);

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


