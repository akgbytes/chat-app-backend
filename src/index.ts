import { WebSocket, WebSocketServer } from "ws";

const ws = new WebSocketServer({ port: 8080 });

const allSockets: WebSocket[] = [];

ws.on("connection", (socket) => {
  allSockets.push(socket);
  console.log(`User connected #`);
  socket.send("successfully connected");

  socket.on("message", (message) => {
    console.log("message received : ", message.toString());
    allSockets.map((s) => {
      if (socket !== s) {
        s.send(message.toString());
      }
    });
  });

  socket.on("close", () => {
    allSockets.filter((s) => s !== socket);
  });
});
