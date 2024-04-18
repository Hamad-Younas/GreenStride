import Answer from "../models/answer.js";

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