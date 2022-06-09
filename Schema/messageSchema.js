let mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
  message: String,
  sender: String,
  timeStamp: { type: String, required: true },
});

exports.messageSchema = messageSchema;
