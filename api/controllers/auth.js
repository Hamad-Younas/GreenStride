import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { transporter } from "../utils/nodemailer.js"

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
      .json({ message:"success", details: { ...otherDetails } });
  } catch (err) {
    next(err);
  }
};