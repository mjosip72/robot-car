
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");

const PORT = process.env.PORT || 8080;
const PATH = path.join(__dirname, "public");

app.use(express.static(PATH));

server.listen(PORT);
