const express = require('express');
const userModel = require('../models/userModel')
const handleUserAuth =async (req,res,next)=>{
    const username = req.headers.username ;
    const password = req.headers.password ;

    const isUserExist = await userModel.findOne({username , password})

    if(isUserExist){
        next()
    }else{
        res.status(403).json({
            msg:"invalid username or password"
        })
    }
}

module.exports = handleUserAuth