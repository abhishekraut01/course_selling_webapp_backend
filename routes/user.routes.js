const express = require("express");
const router = express.Router();
const { userSignup, userLogin, userLogout, userGetCourses, userPurchaseCourses, userGetPurchasedCourses} = require('../controllers/adminController')

router.post('/signup',userSignup)
router.post('/login',userLogin)
router.post('/logout',userLogout)
router.post('/courses:courseId',userPurchaseCourses)

router.get('/courses',userGetCourses)
router.get('/purchasedCourses',userGetPurchasedCourses)

module.exports = router