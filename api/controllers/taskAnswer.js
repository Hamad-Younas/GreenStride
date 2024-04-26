import Answer from "../models/taskAnswer.js";
import User from '../models/User.js'; // Assuming you have a User model
import RAnswer from '../models/answer.js';


export const add = async (req, res, next) => {
    try {
        const { user, task } = req.body;

        // Check if the task response already exists for the specific user and task
        const existingResponse = await Answer.findOne({ user, task });

        if (existingResponse) {
            // If it exists, update the existing task response with the new data
            existingResponse.date = req.body.date;
            existingResponse.reward = req.body.reward;
            existingResponse.res = req.body.res;

            // Save the updated task response
            const updatedResponse = await existingResponse.save();
            return res.status(200).json(updatedResponse);
        } else {
            // If it doesn't exist, create a new task response
            const newResponse = new Answer(req.body);

            // Save the new task response to the database
            const savedResponse = await newResponse.save();
            return res.status(201).json(savedResponse);
        }
    } catch (error) {
        // Handle errors
        next(error);
    }
}




export const getUserResponseTasks = async (req, res) => {
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        // Step 1: Find the response tasks for today's date for each user
        const responseTasks = await Answer.find({ date: formattedDate })
            .populate('user')
            .populate('task');

        // Step 2: Group tasks by user
        const userTasksMap = new Map();
        responseTasks.forEach(task => {
            const userId = task.user._id.toString();
            if (!userTasksMap.has(userId)) {
                userTasksMap.set(userId, {
                    user: task.user,
                    tasks: [],
                    date: formattedDate,
                    totalPoints: 0
                });
            }
            const userTasks = userTasksMap.get(userId);
            userTasks.tasks.push({
                _id: task.task._id,
                type: task.task.type,
                title: task.task.title,
                description: task.task.description,
                reward: task.reward,
                res: task.res,
            });
        });

        // Step 3: Calculate total points from RAnswer for each user
        const totalPoints = await RAnswer.aggregate([
            { $unwind: '$marks' }, // Unwind the marks array
            {
                $group: {
                    _id: '$user',
                    totalPoints: { $sum: '$marks.obtainPoints' }
                }
            }
        ]);

        // Step 4: Update totalPoints in userTasksMap
        totalPoints.forEach(({ _id, totalPoints }) => {
            const userId = _id.toString();
            if (userTasksMap.has(userId)) {
                userTasksMap.get(userId).totalPoints += totalPoints;
            }
        });

        // Step 5: Convert map values to array
        const formattedResponseTasks = [...userTasksMap.values()];

        return res.status(200).json(formattedResponseTasks);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


export const updateTaskResponse = async (req, res) => {
    try {
        const { userId, taskId } = req.query;

        // Find the TaskResponse document based on user and task IDs
        const taskResponse = await Answer.findOneAndUpdate(
            { user: userId, task: taskId },
            req.body,
            { new: true } // Return the updated document
        );

        if (!taskResponse) {
            return res.status(404).json({ message: 'TaskResponse not found' });
        }

        return res.status(200).json(taskResponse);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};