const express = require("express");
const app = express();

//* This allow to create a server in socket.io
const server = require("http").Server(app);

//*Import socket.io and pass the server
const io = require("socket.io")(server);

const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

//*Routes for rooms
app.get("/:room", (req, res) => {
  //*Get the room
  res.render("room", { roomId: req.params.room });
});

//*it run every time we connect to our page
io.on("connection", socket => {
  socket.on("join-room", (roomId, userId) => {
    //* tell to all the users of the same room that we've joined
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(3000);
