const adminModel = require('../models/adminModel')

const HandleAdminAuth = async (req,res,next)=>{
    const username = req.headers.username ;
    const password = req.headers.password ;

    const isUserExist = await adminModel.findOne({username , password})

    if(isUserExist){
        next()
    }else{
        res.status(403).json({
            msg:"invalid username or password"
        })
    }
}

module.exports = HandleAdminAuth