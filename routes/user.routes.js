const express = require("express");
const router = express.Router();
const { userSignup, userLogin, userLogout, userGetCourses, userPurchaseCourses, userGetPurchasedCourses} = require('../controllers/adminController')
const userAuth = require('../middlewares/user.auth')

router.post('/signup',userSignup)
router.post('/login',userLogin)
router.post('/logout',userLogout)
router.post('/courses:courseId',userAuth,userPurchaseCourses)

router.get('/courses',userGetCourses)
router.get('/purchasedCourses',userAuth,userGetPurchasedCourses)

module.exports = router