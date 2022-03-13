

let host = "forest72-robot-car-herokuapp.com";
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
