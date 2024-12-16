const {router} = require('express');
const router = router()
const handleUserAuth = require('../middlewares/userAuth');

router.post('/signup',(req,res)=>{
    
})

router.get('/courses',(req,res)=>{

})

router.post('/courses:courseId',handleUserAuth,(req,res)=>{

})

router.get('/purchasedCourses',handleUserAuth,(req,res)=>{

})


module.exports = router