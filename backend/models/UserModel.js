const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isGRAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    productType: {
      type: String,
      required: true,
      default: "null",
    },
    isRTVAdmin: {
      type: Boolean,
      require: true,
      default: false,
    },
    adminRole: {
      type: String,
      require: true,
      default: "null",
    },
    docType: {
      type: [String],
      default: ["null"],
    },
    showDeleteButton: {
      type: Boolean,
      default: false,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
