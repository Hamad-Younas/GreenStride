import User from "../models/User.js";
import Code from "../models/code.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/nodemailer.js"
import { randomNumber } from "../utils/randNo.js"

export const register = async (req, res, next) => {
  try {
    // Check if a user with the same email or username already exists
    console.log(req.body)
    // Hash the password using bcrypt
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Create a new user
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    // Save the new user to the database
    await newUser.save();

    const responseData = { message: 'data added', responseData: newUser };
    // Sending email logic...
    const mailOptions = {
      from: 'GreenStride',
      to: req.body.email,
      subject: "You have been registered",
      html: `Now you can access our portal`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ error: 'Failed to send email' });
      } else {
        res.status(200).json(responseData);
      }
      transporter.close();
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      $or: [
        { username: req.body.data },
        { email: req.body.data }
      ]
    });

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "success", details: { ...otherDetails } });
  } catch (err) {
    next(err);
  }
};

export const verifyUser = async (req, res, next) => {
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

    const responseData = { message: 'Success', responseData: user };
    // Sending email logic...
    const mailOptions = {
      from: 'GreenStride',
      to: email,
      subject: "Verification code (GreenStride)",
      html: `Here is your 6-digit code ${randomNumber}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(500).json({ error: 'Failed to send email' });
      } else {
        const newCode = new Code({
          user: user._id, // Assuming user ID is provided in the request body
          code: randomNumber,
        });

        // Save the new document to the database
        const savedCode = newCode.save();
        res.status(200).json(responseData);
      }
      transporter.close();
    });
  } catch (err) {
    // Handle any errors
    next(err);
  }
}

export const verifyLatestCode = async (req, res, next) => {
  try {
    // Get the user ID from the request (assuming it is passed as a parameter)
    const userId = req.query.Id;
    const userCode = parseInt(req.query.code);

    console.log(userId)
    // Validate the presence of the user ID
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Find the latest code associated with the user ID
    const latestCodeEntry = await Code.findOne({ user: userId })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .limit(1); // Limit the result to one entry

    // Check if a code was found
    if (latestCodeEntry) {
      // Compare the provided code with the latest code in the database
      if (latestCodeEntry.code === userCode) {
          // Code matches, return success
          return res.status(200).json({ message: 'Success: Code verified.' });
      } else {
          // Code does not match, return error
          return res.status(400).json({ message: 'Error: Code does not match.' });
      }
  } else {
      // No code found for the specified user
      return res.status(404).json({ message: 'No code found for the specified user.' });
  }
  } catch (err) {
    // Pass any errors to the next middleware
    next(err);
  }
};