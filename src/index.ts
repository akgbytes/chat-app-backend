import { WebSocketServer } from "ws";

const ws = new WebSocketServer({ port: 8080 });

let userCount = 0;

ws.on("connection", (socket) => {
  userCount += 1;
  console.log(`User ${userCount} connected`);
  socket.send("successfully connected");
});
