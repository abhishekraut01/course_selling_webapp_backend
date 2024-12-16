const {router} = require('express');
const router = router()
const handleAdminAuth = require('../middlewares/adminAuth')

router.post('/signup',(req,res)=>{

})

router.post('/courses',handleAdminAuth,(req,res)=>{
    
})

router.get('/courses',handleAdminAuth,(req,res)=>{
    
})

module.exports = router