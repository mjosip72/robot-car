
// #region connection

let connectBtn = document.getElementById("connectBtn");

let socket;
let peer;
let connected = false;

connectBtn.addEventListener("click", e => {

  if(connected) {

    socket.close();
    connected = false;
    connectBtn.innerHTML = "Connect";

  }else{

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
      log("Connecting to peer network");

      peer = new Peer("robot", {
        host: peerHost,
        port: 443,
        path: "/peerjs",
        secure: peerSecure
      });

      peer.on("open", id => {
        log("Connected to peer network");
        connected = true;
        connectBtn.innerHTML = "Connected";
      });

    });
  
    socket.on("connection-rejected", reason => {
      log("Connection rejected");
      log("Reason: " + reason);
    });
  
    socket.on("disconnect", () => {
      log("Socket disconnected");
      connected = false;
      connectBtn.innerHTML = "Connect";
    });

  }

});

// #endregion
