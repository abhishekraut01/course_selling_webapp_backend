const express = require("express");
const zod = require('zod')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const bcrypt = require('./bcryptjs')

const Admin = require('../models/admin.models')

const adminSignUpSchema = zod.object({
    username : zod.string(),
    password: zod.string().min(8)
})

const adminSignup = (req, res) => {
    const userRes = adminSignUpSchema.safeParse(req.body);

    if(!userRes.success){
       return res.status(411).json({
            message:"user Input is not valid"
        })
    }

    const {username , password} = req.body
    try {
        const newAdmin = Admin.create({
            username ,
            
        })
    } catch (error) {
        
    }

};

const adminLogin = (req, res) => {};

const adminLogout = (req, res) => {};

const adminCreateCourses = (req, res) => {};

const adminGetCourses = (req, res) => {};

module.exports = {
    adminSignup,
    adminLogin,
    adminLogout,
    adminCreateCourses,
    adminGetCourses
};
