const { mongoose } = require("mongoose");

const adminSchema = mongoose.userSchema({
    username:{
        type:"string",
        require : true,
        unique: true
    },
    password:{
        type:"string",
    }
})

const adminModel = mongoose.model('admin',adminSchema)
module.exports = adminModel