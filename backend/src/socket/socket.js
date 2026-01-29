import { Server } from "socket.io";

let io;

// workspaceId -> Map(socketId -> { socketId, user, fileId })
const presenceMap = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    /* ---------------- JOIN WORKSPACE ---------------- */
    socket.on("join-workspace", ({ workspaceId, user }) => {
      if (!workspaceId) return;

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
    socket.on("join-file", ({ workspaceId, fileId }) => {
      if (!fileId) return;

      socket.join(fileId);

      // ✅ Presence update only if workspaceId provided
      if (workspaceId && presenceMap.has(workspaceId)) {
        const workspaceUsers = presenceMap.get(workspaceId);

        if (workspaceUsers?.has(socket.id)) {
          workspaceUsers.get(socket.id).fileId = fileId;
        }

        io.to(workspaceId).emit(
          "presence-update",
          Array.from(workspaceUsers.values())
        );
      }
    });

    /* ---------------- LEAVE FILE ---------------- */
    socket.on("leave-file", (fileId) => {
      if (!fileId) return;
      socket.leave(fileId);
    });

    /* ---------------- REAL TIME CODE UPDATES ✅ ---------------- */
    socket.on("code-update", ({ fileId, update }) => {
      if (!fileId || !update) return;

      // send to others in file room
      socket.to(fileId).emit("code-update", update);
    });

    /* ---------------- TYPING (FILE BASED ✅) ---------------- */
    socket.on("typing", ({ fileId, user }) => {
      if (!fileId || !user) return;

      // same event name frontend listens to ✅
      socket.to(fileId).emit("typing", user);
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

          if (users.size === 0) {
            presenceMap.delete(workspaceId);
          }
        }
      }
    });
  });
};

export default io;
