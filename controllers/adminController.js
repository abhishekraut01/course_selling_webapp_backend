const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("./bcryptjs");

const Admin = require("../models/admin.models");

const adminSignUpSchema = zod.object({
    username: zod.string(),
    password: zod.string().min(8),
});

const handleHashPassword = (password) => {
    const saltRound = 10;
    const hashPass = bcrypt.hash(password, saltRound);
    return hashPass;
};

const verifyPassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error in verifyPassword:", error.message); 
        throw new Error("Failed to verify password"); 
    }
};



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


const adminLogout = (req, res) => { };

const adminCreateCourses = (req, res) => { };

const adminGetCourses = (req, res) => { };

module.exports = {
    adminSignup,
    adminLogin,
    adminLogout,
    adminCreateCourses,
    adminGetCourses,
};
