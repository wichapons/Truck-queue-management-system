const Queue = require("../models/QueueModel");
const User = require("../models/UserModel");
const ObjectId = require("mongodb").ObjectId;
const dotenv = require("dotenv");
const axios = require("axios");
const qs = require("qs");
const jwt = require("jsonwebtoken");

dotenv.config(); //import dotenv module
const url_line_notification = "https://notify-api.line.me/api/notify";
const line_token = process.env.LINE_TOKEN;

const sendLineNotification = async (req, res, next) => {
  try {
    let queue_id = req.params.id;
    //get data from database
    const queueData = await Queue.findOne({ _id: new ObjectId(queue_id) });

    //prepare data to send to Line API
    let json_data = {
      message: `เรียน ผู้ขนส่งรหัส ${queueData.supplierCode} คิวที่ ${queueData.queueNumber}, ขณะนี้ถึงคิวท่านแล้ว รบกวนมาที่ประตู ${queueData.dockingDoorNumber} ค่ะ`,
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
      .then(async (res) => {
        if (res.data.status == 200) {
          // decode token to get user id
          const token = req.cookies.access_token;
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
          req.user = decoded;

          //UPDATE QUEUE DATA queueCalledBy, queueCalledTime
          await Queue.findOneAndUpdate(
            { _id: new ObjectId(queue_id) },
            {
              queueCalledBy: req.user.name,
              //GMT+7
              queueCalledTime: new Date().toLocaleString("en-US", {
                timeZone: "Asia/Bangkok",
              }),
            }
          );
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
  } catch (err) {
    next(err);
  }
};

const getAllQueue = async (req, res, next) => {
  let queueData = await Queue.find();
  res.status(200).json(queueData);
};

const createNewQueue = async (req, res, next) => {
  try {
    const queue = new Queue();
    const { supcode, goodstype, queuenumber } = req.body;
    queue.supplierCode = supcode;
    queue.goodsType = goodstype;
    queue.queueNumber = queuenumber;

    //check if supplierCode and queueNumber is not empty
    if (queue.supplierCode == "" || queue.queueNumber == "") {
      res.status(400).json({
        message: "supplier code and queue number must not be empty",
      });
      return;
    }

    //check if supplierCode and queueNumber is number
    if (isNaN(queue.supplierCode) || isNaN(queue.queueNumber)) {
      res.status(400).json({
        message: "supplierCode and queueNumber must be number",
      });
      return;
    }

    await queue.save(); // save to database
    res.json({
      message: "New queue created",
      queueId: queue._id,
      supcode: queue.supplierCode,
    });
  } catch (err) {
    next(err);
  }
};

const closeQueue = async (req, res, next) => {
  try {
    const queueID = req.params.id;
    // decode token to get user id
    const token = req.cookies.access_token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    //update queue checkin status to true and add user id
    const queue = await Queue.findOneAndUpdate(
      { _id: new ObjectId(queueID) },
      {
        isCheckin: true,
        queueCloseByUserID: req.user._id,
        queueCloseByUserName: req.user.name,
      }
    );

    res.status(200).json({
      message: "Queue closed",
      queueId: queue._id,
      supcode: queue.supplierCode,
    });
  } catch (err) {
    next(err);
  }
};

const updateDockingNumber = async (req, res, next) => {
  try {
    const queueID = req.params.id;
    const { dockingNumber } = req.body;
    //update queue checkin status to true
    const queue = await Queue.findOneAndUpdate(
      { _id: new ObjectId(queueID) },
      { dockingDoorNumber: dockingNumber }
    );
    res.status(200).json({
      message: "Docking number updated successfully",
      dockingDoorNumber: dockingNumber,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendLineNotification: sendLineNotification,
  getAllQueue: getAllQueue,
  createNewQueue: createNewQueue,
  closeQueue: closeQueue,
  updateDockingNumber: updateDockingNumber,
};
