const express = require("express");
const zod = require('zod')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const bcrypt = require('./bcryptjs')

const Admin = require('../models/admin.models')

const adminSignUpSchema = zod.object({
    username: zod.string(),
    password: zod.string().min(8)
})

const handleHashPassword = (password) => {
    const saltRound = 10;
    const hashPass = bcrypt.hash(password, saltRound)
    return hashPass
}

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


const adminLogin = (req, res) => { };

const adminLogout = (req, res) => { };

const adminCreateCourses = (req, res) => { };

const adminGetCourses = (req, res) => { };

module.exports = {
    adminSignup,
    adminLogin,
    adminLogout,
    adminCreateCourses,
    adminGetCourses
};
