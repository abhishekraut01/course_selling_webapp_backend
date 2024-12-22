const express = require("express");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin.models");
const Course = require("../models/course.models");

const { adminSignUpSchema ,courseSchema } = require('../utils/validationSchema')
const {handleHashPassword , verifyPassword} = require('../utils/encryption')

const adminSignup = async (req, res, next) => {
    const userRes = adminSignUpSchema.safeParse(req.body);

    if (!userRes.success) {
        return res.status(411).json({
            message: "Invalid input",
            errors: userRes.error.errors,
        });
    }

    const { username, password } = req.body;

    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(409).json({ message: "Admin already exists" });
        }

        const hashedPassword = handleHashPassword(password);

        // Create admin
        const newAdmin = await Admin.create({
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
            message: "Admin Created Successfully",
        });
    } catch (error) {
        next(error); // Pass to global error handler
    }
};

// adminLoginWorkflow -> user will send the username and password and we will find is admin is availabe in database or not if yes then we will compare hashed password with plain password and all things are good then we will send the jwt token to user

const adminLogin = async (req, res, next) => {
    const userRes = adminSignUpSchema.safeParse(req.body);

    if (!userRes.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: userRes.error.errors,
        });
    }

    const { username, password } = req.body;

    try {
        // Check for admin presence
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, admin.password);
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
            message: "Admin logged in successfully",
        });
    } catch (error) {
        next(error);
    }
};


const adminLogout = (req, res) => {
    // Clear the JWT cookie by setting it to expire immediately
    res.cookie("jwt", "", {
        httpOnly: true,  // Ensures cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === "production",  // Use secure cookies in production
        sameSite: "strict",  // Ensures cookies are sent in same-site requests
        expires: new Date(0),  // Sets the cookie expiration to the past
    });

    // Send response
    res.status(200).json({
        message: "Logged out successfully",
    });
};

const adminCreateCourses = async (req, res) => {
    // Validate request body using Zod schema
    const validationResult = courseSchema.safeParse(req.body) 

    if (!validationResult.success) {
        return res.status(400).json({
            message: "Invalid input",
            errors: validationResult.errors,
        });
    }

    const { title, description, price, imageLink } = req.body;

    try {
        // Create the course in the database
        const newCourse = new Course({
            title,
            description,
            price,
            imageLink,
        });

        // Save the new course
        const savedCourse = await newCourse.save();

        // Send response with success message and course ID
        res.status(201).json({
            message: "Course created successfully",
            courseId: savedCourse._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create course",
            error: error.message,
        });
    }
};

const adminGetCourses = async (req, res, next) => {
    try {
        const allCourses = await Course.find({});

        if (allCourses.length === 0) {
            return res.status(404).json({
                message: "No courses found",
            });
        }

        res.status(200).json({
            message: "All courses fetched successfully",
            courses: allCourses,
        });
    } catch (error) {
        next(error); 
    }
};

module.exports = {
    adminSignup,
    adminLogin,
    adminLogout,
    adminCreateCourses,
    adminGetCourses,
};