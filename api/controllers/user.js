import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.query.Id;

    // Ensure user ID is provided
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      req.body.password = hash;
    }

    // Find the user and update their information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Respond with the updated user data
    res.status(200).json(updatedUser);
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error.', errors: err.errors });
    }

    // Handle other errors
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}
export const getUser = async (req, res, next) => {
  try {
    // Get the email from the query parameters
    const email = req.query.email;

    // Validate the presence of the email parameter
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Search for a user with the provided email
    const user = await User.findOne({ email });

    // Check if the user was found
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return the user data
    res.status(200).json({ message: 'Success', responseData: user });
  } catch (err) {
    // Handle any errors
    next(err);
  }
}
export const getUsers = async (req, res, next) => {
  console.log("h");
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}