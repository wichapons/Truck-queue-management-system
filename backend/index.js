//Config
const dotenv = require("dotenv");
dotenv.config();

//Express.js
const express = require("express");
const app = express();

//Database
//const connectDB = require("./config/db");
//Database connection
//connectDB();

//Routes
const apiRoutes = require("./routes/apiRoutes");

/*
//error handler
const errorHandler = require("./middlewares/errorHandler")

app.use(errorHandler)
app.use(cookieParser());
app.use(express.json());
*/

app.use("/api", apiRoutes);


//Start server
app.listen(process.env.PORT, () => {
  console.log(`Server started successfully on port ${process.env.PORT}`)
})


