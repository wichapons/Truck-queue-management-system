const mongoose = require("mongoose")

const queueSchema = mongoose.Schema({
    queueCalledBy: {
        type: String,
        required: true,
    },
    dockingDoorNumber: {
        type: Number
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
        type: String,
        required: true,
    },
    queueCalledTime: {
        type: Date,
    },
    isCheckin: {
        type: Boolean,
        required: true,
        default: false
    },

}, {
    timestamps: true,
})

const Queue = mongoose.model("Queue", queueSchema);
  
module.exports = Queue;
