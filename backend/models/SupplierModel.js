const mongoose = require("mongoose")

const supplierSchema = mongoose.Schema({

    sp_code: {
        type: String,
        required: true,
        index: true,
    },
    sp_name: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;






