const mongoose = require('mongoose');

const dbConnect =async  () =>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Your are connected to database successfully on port : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Unable to connect to database" + error)
        process.exit(1)
    }
}

module.exports = dbConnect