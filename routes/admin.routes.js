const express = require("express");
const router = express.Router();
const { adminSignup, adminLogin, adminLogout, adminCreateCourses, adminGetCourses} = require('../controllers/adminController')

router.post('/signup',adminSignup)
router.post('/login',adminLogin)
router.post('/logout',adminLogout)
router.post('/courses',adminCreateCourses)
router.get('/courses',adminGetCourses)

module.exports = router