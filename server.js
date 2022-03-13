
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");

const { ExpressPeerServer } = require("peer");

const peerServer = ExpressPeerServer(server, {
  secure: true
});

const PORT = process.env.PORT || 443;
const PATH = path.join(__dirname, "public");

app.use(express.static(PATH));
app.use("/peerjs", peerServer);

app.get("/robot", (req, res) => {
  res.redirect("/robot.html");
});

function log(message) {
  console.log(message);
}

// #region connection

let robotSocket;
let clientSocket;

function approveConnection(socket, id) {
  log("Connection approved for " + id);
  socket.emit("connection-approved");
}

function rejectConnection(socket, id, reason) {
  log("Connection rejected for " + id);
  log("Reason: " + reason);
  socket.emit("connection-rejected", reason);
  socket.disconnect();
}

function onRequestConnection(socket, id) {

  log("Connection requested by " + id + ", id = " + socket.id);
  
  clearTimeout(socket.disconnectTimeout);
  socket.disconnectTimeout = undefined;

  if(id == "robot") {

    if(robotSocket == undefined) {
      robotSocket = socket;
      approveConnection(socket, id);
    }else{
      rejectConnection(socket, id, "robot is already connected");
    }

  }else if(id == "client") {

    if(clientSocket == undefined) {

      if(robotSocket == undefined) {
        rejectConnection(socket, id, "robot is not connected");
      }else{
        clientSocket = socket;
        approveConnection(socket, id);
      }

    }else{
      rejectConnection(socket, id, "client is already connected");
    }

  }else{
    rejectConnection(socket, id, "unknown id");
  }

}

function onDisconnect(socket) {

  if(socket == robotSocket) {
    robotSocket = undefined;
    log("Robot disconnected");
  }else if(socket == clientSocket) {
    clientSocket = undefined;
    log("Client disconnected");
  }else{
    log("Disconnected socket id = " + socket.id);
  }

}

io.on("connection", socket => {

  log("Connected socket id = " + socket.id);
  socket.disconnectTimeout = setTimeout(() => {
    log("Auto disconnecting socket id = " + socket.id);
    socket.disconnect();
  }, 2000);

  socket.on("request-connection", id => {
    onRequestConnection(socket, id);
  });

  socket.on("disconnect", () => {
    onDisconnect(socket);
  });

});

// #endregion

log("Listen on port " + PORT);
server.listen(PORT);
