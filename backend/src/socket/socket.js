import { Server } from "socket.io";

let io;

// workspaceId -> Map(socketId -> user)
const presenceMap = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    /* ---------------- JOIN WORKSPACE ---------------- */
    socket.on("join-workspace", ({ workspaceId, user }) => {
      socket.join(workspaceId);

      if (!presenceMap.has(workspaceId)) {
        presenceMap.set(workspaceId, new Map());
      }

      presenceMap.get(workspaceId).set(socket.id, {
        socketId: socket.id,
        user,
        fileId: null,
      });

      io.to(workspaceId).emit(
        "presence-update",
        Array.from(presenceMap.get(workspaceId).values())
      );
    });

    /* ---------------- JOIN FILE ---------------- */
    socket.on("join-file", ({ workspaceId, fileId, user }) => {
      socket.join(fileId);

      const workspaceUsers = presenceMap.get(workspaceId);
      if (workspaceUsers?.has(socket.id)) {
        workspaceUsers.get(socket.id).fileId = fileId;
      }

      io.to(workspaceId).emit(
        "presence-update",
        Array.from(workspaceUsers.values())
      );
    });

    /* ---------------- TYPING ---------------- */
    socket.on("typing", ({ workspaceId, user }) => {
      socket.to(workspaceId).emit("user-typing", user);
    });

    /* ---------------- DISCONNECT ---------------- */
    socket.on("disconnect", () => {
      for (const [workspaceId, users] of presenceMap.entries()) {
        if (users.has(socket.id)) {
          users.delete(socket.id);

          io.to(workspaceId).emit(
            "presence-update",
            Array.from(users.values())
          );
        }
      }
    });
  });
};

export default io;
