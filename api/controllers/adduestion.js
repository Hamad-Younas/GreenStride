import Question from "../models/question.js";

export const add = async (req, res, next) => {
    try {
        // Extract data from the request body
        const { type, title, options } = req.body;

        // Validate data if needed
        if (!type || !title || !options || options.length === 0) {
            return res.status(400).json({ error: 'Type, title, and options are required.' });
        }

        // Create a new question instance
        const newQuestion = new Question({
            type,
            title,
            options,
        });

        // Save the question to the database
        const savedQuestion = await newQuestion.save();

        // Respond with the saved question
        res.status(201).json(savedQuestion);
    } catch (error) {
        // Handle Mongoose validation errors
        next(error)
    }
}

export const getAll = async (req, res, next) => {
    try {
      const questions = await Question.find({});
      res.status(200).json(questions);
    } catch (err) {
      next(err);
    }
  }