const mongoose = require("mongoose"); 

const connectDb = async () => {
  try {
    const res = await mongoose.connect(
      "mongodb+srv://Abhishekraut:Abhishek7555@coursesellingapp.kcdpz.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB connected successfully: ${res.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); 
  }
};

module.exports = connectDb;