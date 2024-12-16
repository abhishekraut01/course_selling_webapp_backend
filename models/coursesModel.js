const { mongoose } = require("mongoose");

const courseSchema = mongoose.userSchema({
    title:{
        type:string,
        required:true,
    },
    description:{
        type:string,
    },
    price:{
        type:Number,
        required:true
    },
    imageLink:{
        type:string,
    }
})

const courseModel = mongoose.model('Course',courseSchema)
module.exports = courseModel