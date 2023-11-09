const express = require("express");
const app = express();
const request = require("request");
const dotenv = require("dotenv");
const axios = require("axios");
const qs = require('qs');

dotenv.config(); //import dotenv module

const url_line_notification = "https://notify-api.line.me/api/notify";
const line_token = process.env.LINE_TOKEN;

//api for sending message
app.post("/send-message", async (req, res) => {
  let current_queue = "A001_test";
  let json_data = {message: `Hello world, Your current queue is ${current_queue}`};

  let response = await axios({
    method: "POST",
    url: url_line_notification,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: 'Bearer ' + line_token,
    },
    data: qs.stringify(json_data),
  })
    .then( (res)=>{
      if (res.data.status == 200) {
        return 'message has been send successfully';
      } 
      else {
        return 'failed to send message '+ res.data;
      }
    }
    )
    .catch(function (error) {
      console.log(error);
      return 'something wrong while fetching data to Line API';
    });
    console.log(response);
  res.status(200).send(response);
});


// api for sending image
app.post("/send-image", (req, res) => {
  const imageFile =
    "https://images.freeimages.com/images/large-previews/389/mitze-1380778.jpg";

  request(
    {
      method: "POST",
      uri: url_line_notification,
      header: {
        "Content-Type": "multipart/form-data",
      },
      auth: {
        bearer: line_token,
      },
      form: {
        message: "Send Image!",
        imageThumbnail: imageFile,
        imageFullsize: imageFile,
      },
    },
    (err, httpResponse, body) => {
      if (err) {
        console.log(err);
      } else {
        console.log(body);
      }
    }
  );
});

/*
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");
const verifyAccessToken = require("../utils/verifyAccessToken")

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
*/

module.exports = app;
