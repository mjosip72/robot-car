

let host = "forest72-robot-car.herokuapp.com";
let peerHost = host;
let peerSecure = true;

if(document.location.hostname == "localhost") {
  host = "/";
  peerHost = "localhost";
  peerSecure = false;
}

log("host = " + host);
log("peerHost = " + peerHost);
log("peerSecure = " + peerSecure);

function log(message) {
  console.log(message);
  Toast.show(message);
}

function onConnected() {}

let connectBtn = document.getElementById("connectBtn");

let socket;
let peer;
let connected = false;

connectBtn.addEventListener("click", e => {

  if(connected) {

    socket.close();
    peer.disconnect();
    connected = false;
    connectBtn.innerHTML = "Connect";

  }else{

    socket = io(host);

    socket.on("connect", () => {
      log("Socket connected");
      log("Requesting connection");
      socket.emit("request-connection", ID);
    });
  
    socket.on("connection-approved", () => {

      log("Connection approved");
      log("Connecting to peer network");

      peer = new Peer(ID, {
        host: peerHost,
        port: 443,
        path: "/peerjs",
        secure: peerSecure
      });

      peer.on("open", id => {
        log("Connected to peer network");
        connected = true;
        connectBtn.innerHTML = "Connected";
        onConnected();
      });

      peer.on("disconnected", () => {
        log("Disconnected from peer network");
        socket.close();
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
