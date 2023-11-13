const mongoose = require("mongoose")

const queueSchema = mongoose.Schema({
    queueCalledBy: {
        type: String,
        default: null
    },
    dockingDoorNumber: {
        type: Number,
        default: null
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
    queueCalledTime: {
        type: Date,
        default: null
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
