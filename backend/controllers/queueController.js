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

    const supplierInfo = queueData.suppliers.map((supplier) => {
      const formattedSupplierInfo = `${supplier.supplierCode} ${supplier.supplierName}`;
      return formattedSupplierInfo.length <= 22
        ? formattedSupplierInfo
        : formattedSupplierInfo.slice(0, 24);
    });

    const message = `เชิญคิวที่ ${
      queueData.queueNumber
    }\nผู้ขนส่ง: \n${supplierInfo.join(",\n ")}\nลงของที่ประตู ${
      queueData.dockingDoorNumber
    } ค่ะ`;

    //prepare data to send to Line API
    let json_data = {
      message: message,
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

          //UPDATE QUEUE DATA queueCalledBy, queueCalledTime and increase queueCalledCount by 1

          await Queue.findOneAndUpdate(
            { _id: new ObjectId(queue_id) },
            {
              queueCalledBy: req.user.name,
              //GMT+7
              queueCalledTime: new Date(),
              $inc: { queueCalledCount: 1 },
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
    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

const getQueueByUserRole = async (req, res, next) => {
  const token = req.cookies.access_token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  let userId = decoded._id

  const userInfo = await User.findById(userId).select("adminRole docType").orFail();
  const adminRole = userInfo.adminRole;
  const docType = userInfo.docType;

  //capitalize first character
  // const capitalizeFirstLetter = (str) => {
  //   return str.charAt(0).toUpperCase() + str.slice(1);
  // };

  //productType = capitalizeFirstLetter(productType);

  if (!adminRole) {
    return res.status(400).json({ error: "No admin role found in database" });
  }

  if (adminRole === "All") {
    let queueData = await Queue.find({ isCheckOut: false }).sort({
      queueNumber: 1,
    });
    res.status(200).json(queueData);
  } else {
    let queueData = await Queue.find({
      goodsType: docType,
      isCheckOut: false,
    }).sort({ queueNumber: 1 });
    res.status(200).json(queueData);
  }
  
  
//   if (adminRole === "Checker") {
//     let docType = ["Consignment", "CRL", "PET 'N ME", "Plaza"];
//     let queueData = await Queue.find({
//       goodsType: docType,
//       isCheckOut: false,
//     });
//     res.status(200).json(queueData);
//   } else if(adminRole === "Credit") {
//     let docType = ["Credit","Special","Beutrium"]
//     let queueData = await Queue.find({
//       goodsType: docType,
//       isCheckOut: false,
//     });
//     res.status(200).json(queueData);
//   } else if(adminRole === "Data") {
//     let docType = ["Consignment","CRL"]
//     let queueData = await Queue.find({
//       goodsType: docType,
//       isCheckOut: false,
//     });
//     res.status(200).json(queueData);
// };
}

const createNewQueue = async (req, res, next) => {
  try {
    // decode token to get user id
    const token = req.cookies.access_token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    // Extract supplier-related information from the request body
    const { suppliers, goodstype, queuenumber, isRTV } = req.body;

    /*
    //check if supplierCode and queueNumber is not empty
    if (queue.supplierCode == "" || queue.queueNumber == "") {
      res.status(400).json({
        message: "supplier code and queue number must not be empty",
      });
      return;
    }
    */

    // Check if suppliers array is provided
    if (!suppliers || !Array.isArray(suppliers) || suppliers.length === 0) {
      return res.status(400).json({
        message: "Suppliers array must be provided with at least one supplier",
      });
    }

    // Create a new queue
    const queue = new Queue();
    queue.suppliers = suppliers;
    queue.goodsType = goodstype;
    queue.queueNumber = queuenumber;
    queue.queueCreatedBy = req.user.name;
    queue.isRTV = isRTV;
    /*

    //check if supplierCode and queueNumber is number
    if (isNaN(queue.supplierCode) || isNaN(queue.queueNumber)) {
      res.status(400).json({
        message: "supplierCode and queueNumber must be number",
      });
      return;
    }
    */

    //auto-mataching docking door
    if (
      goodstype === "Consignment" ||
      goodstype === "CRL" ||
      goodstype === "PET 'N ME" ||
      goodstype === "Plaza"
    ) {
      queue.dockingDoorNumber = 50;
    } else if (
      goodstype === "Beautrium" ||
      goodstype === "Credit" ||
      goodstype === "Special"
    ) {
      queue.dockingDoorNumber = 58;
    } else {
      res.json({
        message: "Goods type is not valid",
        queueId: queue._id,
        suppliers: queue.suppliers,
        goodsType: queue.goodsType,
        queueNumber: queue.queueNumber,
      });
      next(err);
      return;
    }

    await queue.save(); // save to database
    res.json({
      message: "New queue created",
      queueId: queue._id,
      suppliers: queue.suppliers,
      goodsType: queue.goodsType,
      queueNumber: queue.queueNumber,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const checkIn = async (req, res, next) => {
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
        checkInByUserID: req.user._id,
        checkInByUserName: req.user.name,
        checkInTime: new Date(),
      }
    );

    res.status(200).json({
      message: "Queue checked in successfully",
      queueId: queue._id,
      supcode: queue.supplierCode,
    });
  } catch (err) {
    next(err);
  }
};

const checkInRTV = async (req, res, next) => {
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
        RTVCheckinByUserName: req.user.name,
        RTVCheckinTime: new Date(),
      }
    );
    res.status(200).json({
      message: "RTV Queue checked in successfully",
      queueId: queue._id,
      supcode: queue.supplierCode,
    });
  } catch (err) {
    next(err);
  }
};

const checkOut = async (req, res, next) => {
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
        isCheckOut: true,
        checkOutByUserID: req.user._id,
        checkOutByUserName: req.user.name,
        checkOutTime: new Date(),
      }
    );

    res.status(200).json({
      message: "Queue checked out successfully",
      queueId: queue._id,
      supcode: queue.supplierCode,
    });
  } catch (err) {
    next(err);
  }
};

const checkOutRTV = async (req, res, next) => {
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
        RTVCheckOutByUserName: req.user.name,
        RTVCheckOutTime: new Date(),
      }
    );

    res.status(200).json({
      message: "RTV Queue checked out successfully",
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

const getRTVQueue = async (req, res, next) => {
  try {
    let queueData = await Queue.find({
      isRTV: true,
      isCheckin: true,
      RTVCheckOutTime: null,
    }).sort({ queueNumber: 1 });
    res.status(200).json(queueData);
  } catch (err) {
    next(err);
  }
};

const getQueueHistory = async (req, res, next) => {
  try {
    if (req.query.startDate) {
      startDate = req.query.startDate;
      endDate = req.query.endDate;
    } else {
      startDate = new Date().toISOString().split("T")[0];
      endDate = new Date().toISOString().split("T")[0];
    }

    // Parse the start and end dates, assuming they are in ISO format (YYYY-MM-DD)
    const startDateTime = new Date(`${startDate}T00:00:00Z`);
    const endDateTime = new Date(`${endDate}T23:59:59Z`);

    // Adjust dates to GMT+7
    startDateTime.setUTCHours(startDateTime.getUTCHours() - 7);
    endDateTime.setUTCHours(endDateTime.getUTCHours() - 7);

    let queueData = await Queue.find({
      isCheckOut: true,
      //isRTV: false,
      createdAt: { $gte: startDateTime, $lt: endDateTime },
    }).sort({ createdAt: 1, checkOutTime: 1 });

    res.status(200).json(queueData);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  sendLineNotification: sendLineNotification,
  getQueueByUserRole: getQueueByUserRole,
  createNewQueue: createNewQueue,
  checkIn: checkIn,
  updateDockingNumber: updateDockingNumber,
  checkOut: checkOut,
  getRTVQueue: getRTVQueue,
  checkInRTV: checkInRTV,
  checkOutRTV: checkOutRTV,
  getQueueHistory: getQueueHistory,
};
