let mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  userName: String,
  emailId: String,
  rooms: {
    type: [mongoose.Schema.Types.Mixed],
  },
});

var User = new mongoose.model("User", userSchema);
exports.userModel = User;
