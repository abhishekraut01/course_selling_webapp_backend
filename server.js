const dotenv = require('dotenv')
dotenv.config()

const express = require("express");
const app = express()
const cookieParser = require("cookie-parser");

//connect database
const dbConnect = require('./db/dbConnection')
dbConnect()

//importing the routes for admin and user
const adminRoute = require('./routes/admin.routes')
const userRoute = require('./routes/user.routes')

//middlewares for parsing body and form content
app.use(express.json)
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use('/admin',adminRoute)
app.use('/user',userRoute)

//handling error globally
app.use((err, req, res, next) => {
    console.error(err.stack); // Logs the error stack for debugging
    // Customize the error response
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err : {}, // Include error details in development
    });
  });
  

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});