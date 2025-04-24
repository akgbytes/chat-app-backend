import { WebSocket, WebSocketServer } from "ws";

const ws = new WebSocketServer({ port: 8080 });

const allSockets: Map<string, WebSocket[]> = new Map();

ws.on("connection", (socket) => {
  socket.send("successfully connected");

  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString());

    // join a room
    if (parsedMessage.type === "join") {
      let roomId = parsedMessage.payload.roomId;
      let existing = allSockets.get(roomId);
      if (existing) {
        existing.push(socket);
      } else {
        allSockets.set(roomId, [socket]);
      }
    }

    // send message to room memberss
    if (parsedMessage.type === "chat") {
      for (const [roomId, sockets] of allSockets.entries()) {
        if (sockets.includes(socket)) {
          sockets.forEach((s) => {
            if (s !== socket) {
              s.send(parsedMessage.payload.message);
            }
          });
          break;
        }
      }
    }
  });
  socket.on("close", () => {
    for (const [roomId, sockets] of allSockets.entries()) {
      const index = sockets.indexOf(socket);
      if (index !== -1) {
        sockets.splice(index, 1);
        if (sockets.length === 0) {
          allSockets.delete(roomId);
        }
      }
    }
  });
});
