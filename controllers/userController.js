const express = require("express");
const {userSignUpSchema} = require('../utils/validationSchema');
const User = require("../models/user.models");
const { handleHashPassword } = require("../utils/encryption");
const jwt = require("jsonwebtoken");

const userSignup =async (req, res) => {
    const validationResult = userSignUpSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(411).json({
            message: "Invalid input",
            errors: validationResult.error.errors,
        });
    }

    const { username, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = handleHashPassword(password);

        // Create user
        const newUser = await User.create({
            username,
            password: hashedPassword,
        });

        // Generate token
        const token = jwt.sign({ username }, process.env.JWT_KEY);

        // Set cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });

        // Send response
        return res.status(200).json({
            message: "User Created Successfully",
        });
    } catch (error) {
        next(error); //Pass to global error handler
    }
};

const userLogin =async (req, res) => {
    const validationResult = userSignUpSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: validationResult.error.errors,
        });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign({ username }, process.env.JWT_KEY);

        // Set cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000, // Default to 24 hours
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        // Respond
        res.status(200).json({
            message: "User logged in successfully",
        });
    } catch (error) {
        next(error);
    }
};

const userLogout = (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({
        message: "Logged out successfully",
    });
};

const userPurchaseCourses = async (req, res, next) => {
    const courseId = req.params.courseId;
    const { username } = req.user;
  
    try {
      // Validate inputs
      if (!courseId) {
        throw new Error("Course ID is required.");
      }
      // Update user's purchased courses
      const updatedUser = await User.findOneAndUpdate(
        { username },
        {
          $push: { purchasedCourses: courseId },
        },
        { new: true } // Return the updated document
      );
  
      // Check if user exists
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }
  
      // Respond with success
      res.status(200).json({
        success: true,
        message: "Course purchased successfully.",
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };
  
const userGetCourses = (req, res) => {};

const userGetPurchasedCourses = (req, res) => {};

module.exports = {
    userSignup,
    userLogin,
    userLogout,
    userGetCourses,
    userPurchaseCourses,
    userGetPurchasedCourses
};
