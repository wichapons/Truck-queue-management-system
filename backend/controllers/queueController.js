const Queue = require("../models/QueueModel");
const User = require("../models/UserModel");
const ObjectId = require("mongodb").ObjectId;
const dotenv = require("dotenv");
const axios = require("axios");
const qs = require('qs');

dotenv.config(); //import dotenv module
const url_line_notification = "https://notify-api.line.me/api/notify";
const line_token = process.env.LINE_TOKEN;

const sendLineNotification = async (req, res, next) => {
let queue_id = req.params.id;
  let current_queue = "A001_test";
  let json_data = {
    message: `Hello world, Your current queue is ${queue_id}`,
  };

  let response = await axios({
    method: "POST",
    url: url_line_notification,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + line_token,
    },
    data: qs.stringify(json_data),
  })
    .then((res) => {
      if (res.data.status == 200) {
        return "message has been send successfully";
      } else {
        return "failed to send message " + res.data;
      }
    })
    .catch(function (error) {
      console.log(error);
      return "something wrong while fetching data to Line API";
    });
  console.log(response);
  res.status(200).send(response);
};

module.exports = {
    sendLineNotification: sendLineNotification,
};
