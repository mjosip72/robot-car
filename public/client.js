
const ID = "client";

let streamBtn = document.getElementById("streamBtn");

let clientVideo = document.getElementById("clientVideo");
let robotVideo = document.getElementById("robotVideo");

let clientStream;
let robotStream;

streamBtn.addEventListener("click", e => {

  const constraints = {
    audio: true,
    video: false
  };

  log("Requesting media");

  navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {

    log("Success");
    clientStream = stream;
    clientVideo.srcObject = stream;

    //socket.emit("request-stream");
    sendStream();

  })
  .catch(error => {
    log("Error");
  });

});



function sendStream() {

  log("Sending stream to robot");

  let call = peer.call("robot", clientStream);
  /*call.on("stream", stream => {
    log("Got robot stream");
    robotStream = stream;
    robotVideo.srcObject = stream;
  });*/

}

function onConnected() {

  peer.on("call", call => {
    call.answer(null);
    call.on("stream", stream => {
      log("Got robot stream");
      robotStream = stream;
      robotVideo.srcObject = stream;
    });
  });

}
