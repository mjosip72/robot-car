
const ID = "robot";

let streamBtn = document.getElementById("streamBtn");

let clientVideo = document.getElementById("clientVideo");
let robotVideo = document.getElementById("robotVideo");

let clientStream;
let robotStream;

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
  /*call.on("stream", stream => {
    log("Got client stream");
    clientStream = stream;
    clientStream.srcObject = stream;
  });*/

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

  /*peer.on("call", call => {

    call.answer(robotStream);
  
    call.on("stream", stream => {
      log("Got client stream");
      clientStream = stream;
      clientVideo.srcObject = stream;
    });
  
  });*/

}
