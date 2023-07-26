const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
app.use(cors());
const port = 3001;

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log("User has connected: " + socket.id);

  socket.emit("client-connect", {
    message: "Chat connected",
    id: socket.id,
  });

  socket.on("message", (data) => {
    console.log("Received message:", data);
    io.emit("message", data); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("A client has disconnected");
  });
});

// Dummy API route
app.get("/api/data", (req, res) => {
  const data = {
    message: "Hello from the dummy API!",
    timestamp: new Date().toISOString(),
  };

  res.json(data);
});

// Start the server
http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
