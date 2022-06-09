const controller = require("./controllers/db");
const db = controller.db;
const express = require("express");
const cors = require("cors");
const app = express();
const httpServer = require("http").createServer(app);
var session = require("express-session");
require("dotenv").config();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const options = { cors: { origin: "*" } };
const io = require("socket.io")(httpServer, options);

//Check existing session
app.post("/session", (req, res) => {});
//LOGIN TO THE APP
app.post("/login", (req, res) => {
  const credential = req.body;
  const email = credential.email;
  const name = credential.name;
  const response = (val) => {
    res.send(val);
  };
  controller.CreateUser(name, email, response);
});
//Logout
app.get("/logout", (req, res) => {});

//CREATE A NEW ROOM
app.get("/createRoom/:name", (req, res) => {
  var name = req.params.name;
  var time = new Date();
  const response = (val) => {
    res.send(val);
  };
  controller.CreateRoom(name, time, response);
});

//Asking for the message History
app.post("/askMsg", (req, res) => {
  var { roomName, timeStamp } = req.body;
  const response = (val) => {
    res.send(val);
  };
  controller.askMsg(roomName, timeStamp, response);
});

//Removing the user from the database
app.get("/removeUser/:email/:roomName", (req, res) => {
  var { email, roomName } = req.params;
  const response = (val) => {
    res.send(val);
  };
  controller.removeUser(email, roomName, response);
});

//socket io connection
io.on("connection", (socket) => {
  console.log("socket id is:" + socket.id);
  socket.emit("welcome", { message: "hi this is a welcome msg" });
  socket.on("userData", (cont) => {
    const data = cont.data;
    return;
  });
  socket.on("disconnect", (socket) => {
    console.log("this socket was disconnected: " + socket.id);
  });
  socket.on("sendMsg", (data) => {
    data = data.data;
    var msg = data.msg;
    var sender = data.sender;
    var roomName = data.roomName;
    var timeStamp = data.timeStamp;
    const response = (val) => {
      io.sockets.emit("updatedDB", val);
      return;
    };
    controller.sendMsg(roomName, msg, sender, timeStamp, response);
    return;
  });
  socket.on("addUser", (data) => {
    var email = data.cred.emailId;
    var room = data.roomName;
    var time = data.timeStamp;
    const response = (val) => {
      socket.emit("addedUser", val);
      return;
    };
    controller.enrollUser(email, time, room, response);
    return;
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log("the app has started in: " + process.env.PORT);
});
