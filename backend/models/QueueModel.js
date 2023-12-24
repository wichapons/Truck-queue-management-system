const mongoose = require("mongoose")

const queueSchema = mongoose.Schema({
    dockingDoorNumber: {
        type: Number,
        default: null
    },
    suppliers: [
        {
          supplierName: {
            type: String,
            required: true,
          },
          supplierCode: {
            type: String,
            required: true,
          },
        },
      ],
    goodsType: {
        type: String,
        required: true
    },
    queueNumber: {
        type: Number,
        required: true,
    },
    queueCreatedBy: {
        type: String,
        default: null
    },
    queueCalledBy: {
        type: String,
        default: null
    },
    queueCalledTime: {
        type: Date,
        default: null
    },
    queueCalledCount: {
        type: Number,
        default: 0
    },
    isCheckin: {
        type: Boolean,
        required: true,
        default: false
    },
    checkInTime:{
        type: Date,
        default: null
    },
    checkInByUserID: {
        type: String,
        default: null
    },
    checkInByUserName: {
        type: String,
        default: null
    },
    isCheckOut: {
        type: Boolean,
        required: true,
        default: false
    },
    checkOutTime:{
        type: Date,
        default: null
    },
    checkOutByUserID: {
        type: String,
        default: null
    },
    checkOutByUserName: {
        type: String,
        default: null
    },
    isRTV:{
        type: Boolean,
        required: true,
        default: false
    },
    RTVCheckinTime:{
        type: Date,
        default: null
    },
    RTVCheckinByUserName: {
        type: String,
        default: null
    },
    RTVCheckOutByUserName:{
        type: String,
        default: null
    },
    RTVCheckOutTime:{
        type: Date,
        default: null
    }

}, {
    timestamps: true,
})

const Queue = mongoose.model("Queue", queueSchema);
  
module.exports = Queue;
