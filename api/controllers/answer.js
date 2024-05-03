import Answer from "../models/answer.js";
import TaskResponse from '../models/taskAnswer.js';
import mongoose from 'mongoose';

export const add = async (req, res, next) => {
  try {

    // Validate data if needed
    if (!req.body) {
      return res.status(400).json({ error: 'user, question, and answer are required.' });
    }

    // Create a new question instance
    const newAns = new Answer(req.body);

    // Save the question to the database
    const saved = await newAns.save();

    // Respond with the saved question
    res.status(201).json(saved);
  } catch (error) {
    // Handle Mongoose validation errors
    next(error)
  }
}

export const getAll = async (req, res, next) => {
  try {
    const ans = await Answer.find({});
    res.status(200).json(ans);
  } catch (err) {
    next(err);
  }
}

export const get = async (req, res, next) => {
  try {
    // Get the user ID from the request parameters, query string, or wherever it's coming from
    const userId = req.query.Id; // Assuming user ID is passed in the URL parameter
    // Retrieve answers associated with the specific user
    const userAnswers = await Answer.find({ user: userId }).populate('user');

    // Send the user's answers as the response
    res.status(200).json(userAnswers);
  } catch (err) {
    // Pass any errors to the error handling middleware
    next(err);
  }
}


export const getUserAnswersSummary = async (req, res, next) => {
  try {
    const userId = req.query.Id; // Retrieve the user ID from the query parameters

    // Aggregation pipeline
    const summary = await Answer.aggregate([
      // Filter answers for the specific user
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      // Unwind the marks array to process each mark object individually
      { $unwind: '$marks' },
      // Perform a lookup to join with the Question collection
      {
        $lookup: {
          from: 'questions', // Collection name for questions
          localField: 'marks.question', // Local field in Answer model to join on
          foreignField: '_id', // Foreign field in Question model to join on
          as: 'question' // Store the joined data in 'question' array
        }
      },
      // Unwind the joined question data
      { $unwind: '$question' },
      // Group by question type and sum the obtained points
      {
        $group: {
          _id: '$question.type', // Group by the question type
          obtainMarks: { $sum: '$marks.obtainPoints' } // Sum the obtained points
        }
      },
      // Optional: sort the results by question type
      { $sort: { _id: 1 } }
    ]);

    // Respond with the aggregated summary data
    res.json(summary);
  } catch (error) {
    // Handle any errors that may arise
    next(error);
  }
};


export const getUserScores = async (req, res) => {
  try {
    // Use an aggregation pipeline to calculate the total obtained points and reward for each user
    const results = await Answer.aggregate([
      {
        $unwind: '$marks', // Unwind the marks array to access each mark
      },
      {
        $group: {
          _id: '$user', // Group by the user
          totalPoints: { $sum: '$marks.obtainPoints' }, // Calculate the total points
        },
      },
      {
        $lookup: {
          from: 'users', // Join with the User model
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo', // Unwind the userInfo array
      },
      {
        $project: {
          fullname: '$userInfo.fullname', // Project the user's full name
          username: '$userInfo.username', // Project the user's username
          totalPoints: 1, // Project the total points
        },
      },
      {
        $sort: {
          totalPoints: -1, // Sort by total points in descending order
        },
      },
      {
        $limit: 10, // Limit the results to 10 objects
      },
      {
        $lookup: {
          from: 'taskresponses', // Join with the TaskResponse model
          localField: '_id',
          foreignField: 'user',
          as: 'userResponses',
        },
      },
      {
        $project: {
          fullname: 1,
          username: 1,
          totalPoints: 1,
          totalReward: { $sum: '$userResponses.reward' }, // Calculate the total reward
        },
      },
      {
        $sort: {
          totalReward: -1, // Sort by total reward in descending order
        },
      },
    ]);

    // Send the results as a response
    res.json(results);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
  }
};
