import { Server } from "socket.io";

let io;
const users = {}; // socket.id -> { fileId, user }

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {

    // User joins a file
    socket.on("join-file", ({ fileId, user }) => {
      socket.join(fileId);
      users[socket.id] = { fileId, user };

      socket.to(fileId).emit("user-joined", user);
    });

    // CRDT updates (real-time code sync)
    socket.on("code-update", ({ fileId, update }) => {
  socket.to(fileId).emit("code-update", update);
});


    // Typing indicator
    socket.on("typing", () => {
      const data = users[socket.id];
      if (data) {
        socket.to(data.fileId).emit("typing", data.user);
      }
    });

    // User disconnects
    socket.on("disconnect", () => {
      const data = users[socket.id];
      if (data) {
        socket.to(data.fileId).emit("user-left", data.user);
        delete users[socket.id];
      }
    });
  });
};

export default io;
