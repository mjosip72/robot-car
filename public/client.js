
const ID = "client";

let streamBtn = document.getElementById("streamBtn");

let clientVideo = document.getElementById("clientVideo");
let robotVideo = document.getElementById("robotVideo");

let clientStream;
let robotStream;

let dataConnection;

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

    sendStream();

  })
  .catch(error => {
    log("Error");
  });

});

function sendStream() {

  log("Sending stream to robot");
  let call = peer.call("robot", clientStream);

  dataConnection = peer.connect("robot");

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


let robotCommands = {
  forward: 20,
  backward: 21,
  left: 22,
  right: 23,
  stop: 32,
  setSpeed: 100,
  speedNormal: 101,
  speedSlow: 102,
  speedFast: 103
};

let canvas = document.getElementById("canvas");
let g = canvas.getContext("2d");

window.addEventListener("keydown", e => { keyEvent(e.code, true); });
window.addEventListener("keyup", e => { keyEvent(e.code, false); });

let robot = {

  moveForward: false,
  moveBackward: false,
  turnLeft: false,
  turnRight: false,

  lastCommand: 0,

  decodeCommand: function(cmd) {
    switch(cmd) {
      case 20: return "forward";
      case 21: return "backward";
      case 22: return "left";
      case 23: return "right";
      case 32: return "stop";
      case 101: return "speedNormal";
      case 102: return "speedSlow";
      case 103: return "speedFast";
    }
  },

  sendCommand: function(cmd) {

    robot.lastCommand = cmd;
    console.log(robot.decodeCommand(cmd));

    if(connected) dataConnection.send(cmd);

  }


};



function keyEvent(code, down) {

  switch(code) {

    case "KeyW":
      robot.moveForward = down;
      break;

    case "KeyS":
      robot.moveBackward = down;
      break;

    case "KeyA":
      robot.turnLeft = down;
      break;

    case "KeyD":
      robot.turnRight = down;
      break;

  }

  let cmd = robotCommands.stop;

  if(robot.turnLeft && !robot.turnRight) cmd = robotCommands.left;
  else if(robot.turnRight && !robot.turnLeft) cmd = robotCommands.right;
  else if(robot.moveForward && !robot.moveBackward) cmd = robotCommands.forward;
  else if(robot.moveBackward && !robot.moveForward) cmd = robotCommands.backward;

  if(cmd != robot.lastCommand) robot.sendCommand(cmd);

}

function render() {

  let width = canvas.clientWidth;
  let height = canvas.clientHeight;

  g.drawImage(robotVideo, 0, 0, width, height);

}

setInterval(() => {
  render();
}, 1000 / 60);
