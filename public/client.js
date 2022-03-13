

let connectBtn = document.getElementById("connectBtn");

let socket;

connectBtn.addEventListener("click", e => {

  if(socket) socket.close();

  socket = io(host);

  if(!socket) {
    log("Connection error");
    return;
  }

  socket.on("connect", () => {
    log("Socket connected");
    log("Requesting connection");
    socket.emit("request-connection", "robot");
  });

  socket.on("connection-approved", () => {
    log("Connection approved");
  });

  socket.on("connection-rejected", reason => {
    log("Connection rejected");
    log("Reason: " + reason);
  });

  socket.on("disconnect", () => {
    log("Socket disconnected");
  });

});
