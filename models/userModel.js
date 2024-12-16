const { mongoose } = require("mongoose");

const userSchema = mongoose.userSchema({
    username:{
        type:"string",
        require : true,
        unique: true
    },
    password:{
        type:"string"
    },
    purchasedCourses:[{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }]
})

const userModel = mongoose.model('user',userSchema)
module.exports = userModel