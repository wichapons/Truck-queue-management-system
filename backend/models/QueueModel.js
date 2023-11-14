const mongoose = require("mongoose")

const queueSchema = mongoose.Schema({
    dockingDoorNumber: {
        type: Number,
        default: null
    },
    supplierName:{
        type: String,
        required: true
    },
    supplierCode:{
        type: Number,
        required: true
    },
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
    queueCloseByUserID: {
        type: String,
        default: null
    },
    queueCloseByUserName: {
        type: String,
        default: null
    },
}, {
    timestamps: true,
})

const Queue = mongoose.model("Queue", queueSchema);
  
module.exports = Queue;
