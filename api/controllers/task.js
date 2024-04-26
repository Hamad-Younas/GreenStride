import Task from "../models/task.js";
import Answer from "../models/taskAnswer.js";
import mongoose from 'mongoose';

export const getTaskQuestions = async (req, res) => {
  try {
    const userId = req.query.userId; // Get the user ID from the request

    // Get the current date
    const currentDate = new Date();

    // Get the day of the year (1-365)
    const dayOfYear = Math.floor((currentDate - new Date(currentDate.getFullYear(), 0, 0)) / 86400000);

    const totalTasks = await Task.countDocuments();
    // Calculate the starting index for the questions
    let startIndex = (dayOfYear - 1) % (totalTasks - 3);

    const filteredTasks = [];

    while (filteredTasks.length < 3 && startIndex < totalTasks) {
      // Find tasks
      const tasks = await Task.aggregate([
        { $skip: startIndex },
        { $limit: 3 - filteredTasks.length }, // Limit based on remaining slots
        {
          $addFields: {
            taskId: "$_id" // Add a new field taskId to store the _id of each task
          }
        }
      ]);

      for (const task of tasks) {
        // Check if any task response for this task and user has a reward of 1
        const taskResponse = await Answer.findOne({
          user: userId,
          task: task.taskId,
          reward: 1
        });

        if (!taskResponse) {
          filteredTasks.push(task);
        }
      }

      // Move to the next set of tasks
      startIndex += 3;
    }

    res.status(200).json({ task: filteredTasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};