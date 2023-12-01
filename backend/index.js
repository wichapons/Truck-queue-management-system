//Config
const dotenv = require("dotenv");
dotenv.config();

//Express.js
const express = require("express");
const app = express();
//Cookie
const cookieParser = require("cookie-parser");

//Database
const connectDB = require("./config/db");
//Database connection
connectDB();

//Routes
const apiRoutes = require("./routes/apiRoutes");


//error handler
const errorHandler = require("./middlewares/errorHandler")

app.use(errorHandler)
app.use(cookieParser());
// Increase payload size limit to 10MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use("/api", apiRoutes);


//Start server
app.listen(process.env.PORT, () => {
  console.log(`Server started successfully on port ${process.env.PORT}`)
})


