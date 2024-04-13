import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
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