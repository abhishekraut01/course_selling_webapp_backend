const express = require("express");
const router = express.Router();
const { adminSignup, adminLogin, adminLogout, adminCreateCourses, adminGetCourses} = require('../controllers/adminController')
const handleAdminAuth = require('../middlewares/admin.auth')

router.post('/signup',adminSignup)
router.post('/login',adminLogin)
router.post('/logout',adminLogout)
router.post('/courses',handleAdminAuth,adminCreateCourses)
router.get('/courses',handleAdminAuth,adminGetCourses)

module.exports = router