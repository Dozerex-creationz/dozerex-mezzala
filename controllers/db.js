require("dotenv").config();
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true });

function arrayRemove(arr, value) {
  return arr.filter(function (ele) {
    return ele != value;
  });
}

const Chat = require("./../Schema/chatSchema").chatModel;
const User = require("./../Schema/userSchema").userModel;
const msgSchema = require("./../Schema/messageSchema").messageSchema;
var MsgModel = new mongoose.model("msg", msgSchema);
const CreateUser = (name, email, res) => {
  User.findOne({ userName: name, emailId: email }, (err, data) => {
    if (err) console.log(err);
    if (data && data.rooms) {
      res(data);
    } else if (data) {
      res(data);
    } else {
      var user = new User({ userName: name, emailId: email, rooms: [] });
      user.save((err, data) => {
        res(data);
      });
    }
  });
};
var CreateRoom = (roomName, timeStamp, res) => {
  Chat.findOne({ roomName: roomName }, (err, data) => {
    if (err) console.log(err);
    if (data) {
      res("room already exists");
    } else {
      var room = new Chat({
        roomName: roomName,
        chats: [
          {
            message: "This room was Created",
            sender: "System",
            timeStamp: timeStamp,
          },
        ],
      });
      room.save((err, data) => {
        res(data);
      });
    }
  });
};
var enrollUser = (email, timeStamp, roomName, res) => {
  var final = {};
  Chat.findOne({ roomName: roomName }, (err, data) => {
    if (err) console.log(err);
    if (data) {
      final = {
        roomName: roomName,
      };
    } else {
      var room = new Chat({
        roomName: roomName,
        chats: [
          {
            message: "This room was Created",
            sender: "System",
            timeStamp: timeStamp,
          },
        ],
      });
      room.save((err, data) => {});
      final = {
        roomName: roomName,
      };
    }
    User.findOne({ emailId: email }, (err, data) => {
      if (err) console.log(err);
      if (data) {
        var flag = 0;
        data.rooms.map((x) => {
          if (x.roomName == roomName) {
            flag = 1;
          }
        });
      }
      if (flag == 1) {
        res("user already in the room");
        return 0;
      }
      if (data && flag == 0) {
        data.rooms = [...data.rooms, final];
        data.save((err, data) => {
          res(data);
        });
      } else {
        res("no such user exists in that room");
      }
    });
  });
};

var removeUser = (email, roomId, res) => {
  User.findOne({ emailId: email }, (err, data) => {
    if (err) console.log(err);
    if (data) {
      data.rooms = arrayRemove(data.rooms, roomId);
      data.save((err, data) => {
        res(data);
      });
    } else {
      res("user doesnt belong to that room");
    }
  });
};

var sendMsg = (roomName, message, sender, timeStamp, res) => {
  var msg = new MsgModel({
    message: message,
    sender: sender,
    timeStamp: timeStamp,
  });
  var len = 0;
  Chat.findOne({ roomName: roomName }, (err, data) => {
    if (err) console.log(err);
    if (data) {
      data.chats = [...data.chats, msg];
      data.save();
      len = data.chats.length;
      res(data);
      return;
    } else {
      res("no such room");
      return;
    }
  });
};

var askMsg = (rName, timeStamp, res) => {
  Chat.findOne({ roomName: rName }, (err, data) => {
    if (err) console.log(err);
    if (data) {
      res(data);
    } else {
      var room = new Chat({
        roomName: rName,
        chats: [
          {
            message: "This room was Created",
            sender: "System",
            timeStamp: timeStamp,
          },
        ],
      });
      room.save((err, data) => {
        res(data);
      });
    }
  });
};

exports.CreateUser = CreateUser;
exports.CreateRoom = CreateRoom;
exports.enrollUser = enrollUser;
exports.removeUser = removeUser;
exports.sendMsg = sendMsg;
exports.askMsg = askMsg;
