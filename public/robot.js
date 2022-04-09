
const ID = "robot";

let streamBtn = document.getElementById("streamBtn");

let clientVideo = document.getElementById("clientVideo");
let robotVideo = document.getElementById("robotVideo");

let clientStream;
let robotStream;

let dataConnection;

streamBtn.addEventListener("click", e => {

  const constraints = {
    audio: true,
    video: { facingMode: { exact: "environment" } }
  };

  if(host == "/") constraints.video = true;

  log("Requesting media");

  navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {

    log("Success");
    robotStream = stream;
    robotVideo.srcObject = stream;

  })
  .catch(error => {
    log("Error");
  });

});

function sendStream() {

  log("Sending stream to client");
  let call = peer.call("client", robotStream);

}

function onConnected() {

  peer.on("call", call => {
    call.answer(null);
    call.on("stream", stream => {
      log("Got client stream");
      clientStream = stream;
      clientVideo.srcObject = stream;
    });
    sendStream();
  });

  peer.on("connection", conn => {
    conn.on("data", data => {
      BLE.send(data);
    });
  });

}

let bleBtn = document.getElementById("bleBtn");
bleBtn.addEventListener("click", e => {
  if(BLE.connected) BLE.disconnect();
  else BLE.connect();
});