const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectDb = require('./models/connectDb')
connectDb();

const PORT = process.env.PORT || 3000

const adminRouter = require('./routes/admin')
const userRouter = require('./routes/user')

// Middleware to parse JSON request bodies
app.use(express.json());
app.use('/admin',adminRouter)
app.use('/user',userRouter)

app.use((err,req,res,next)=>{
    if(err){
        res.json({
            msg:"something is wrong with your server"
        })
    }
    next()
})

app.listen(PORT , ()=>{
    console.log("server is running on port"+PORT)
})
