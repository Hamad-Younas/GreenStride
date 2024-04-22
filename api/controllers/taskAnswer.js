import Answer from "../models/taskAnswer.js";

export const add = async (req, res, next) => {
    try {
        console.log("dsd",req.body)
        // Validate data if needed
        if (!req.body) {
            return res.status(400).json({ error: 'file is required.' });
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