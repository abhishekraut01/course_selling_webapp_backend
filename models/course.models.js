const mongoose = require("mongoose")
const { string } = require("zod")

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    isPublished:{
        type:string,
        required:true,
        default:false
    },
    imageLink:{
        type:string,
        required:true
    }
})

const Course = mongoose.model("Course" , courseSchema)
module.exports = Course