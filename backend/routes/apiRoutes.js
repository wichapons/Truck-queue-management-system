const express = require("express");
const app = express();

const userRoutes = require("./userRoutes");
const queueRoutes = require("./queueRoutes");
const supplierRoutes = require("./supplierRoutes");
const verifyAccessToken = require("../utils/verifyAccessToken")

app.get("/get-token", (req, res) => {
  verifyAccessToken(req, res);
});

app.get("/logout", (req, res) => {
  return res.clearCookie("access_token").send("access token cleared");
});

app.use("/queue", queueRoutes);
app.use("/users", userRoutes);
app.use("/suppliers", supplierRoutes);

//api for sending message
/*
app.post("/send-message", async (req, res) => {
  
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

*/






module.exports = app;
