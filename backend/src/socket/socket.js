
import { Server } from "socket.io";
import ChatMessage from "../models/ChatMessage.js";

let io;
const presenceMap = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {

    /* ===============================
       JOIN WORKSPACE
    =============================== */
    socket.on("join-workspace", ({ workspaceId, user }) => {
      if (!workspaceId) return;

      socket.join(workspaceId);

      if (!presenceMap.has(workspaceId)) {
        presenceMap.set(workspaceId, new Map());
      }

      presenceMap.get(workspaceId).set(socket.id, {
        socketId: socket.id,
        user,
        fileId: null
      });

      io.to(workspaceId).emit(
        "presence-update",
        Array.from(presenceMap.get(workspaceId).values())
      );
    });

    /* ===============================
       JOIN FILE
    =============================== */
    socket.on("join-file", ({ workspaceId, fileId, user }) => {
      if (!fileId) return;

      socket.join(fileId);

      if (workspaceId) {
        socket.join(workspaceId);

        if (!presenceMap.has(workspaceId)) {
          presenceMap.set(workspaceId, new Map());
        }

        const users = presenceMap.get(workspaceId);

        if (!users.has(socket.id)) {
          users.set(socket.id, {
            socketId: socket.id,
            user,
            fileId
          });
        } else {
          users.get(socket.id).fileId = fileId;
        }

        io.to(workspaceId).emit(
          "presence-update",
          Array.from(users.values())
        );
      }
    });

    /* ===============================
       LEAVE FILE
    =============================== */
    socket.on("leave-file", ({ workspaceId, fileId }) => {
      if (!fileId) return;

      socket.leave(fileId);

      if (workspaceId && presenceMap.has(workspaceId)) {
        const users = presenceMap.get(workspaceId);

        if (users.has(socket.id)) {
          users.get(socket.id).fileId = null;
        }

        io.to(workspaceId).emit(
          "presence-update",
          Array.from(users.values())
        );
      }
    });

    /* ===============================
       REALTIME CODE
    =============================== */
    socket.on("code-update", ({ fileId, update }) => {
      if (fileId && update) {
        socket.to(fileId).emit("code-update", update);
      }
    });

    /* ===============================
       TYPING
    =============================== */
    socket.on("typing", ({ fileId, user }) => {
      if (fileId && user) {
        socket.to(fileId).emit("typing", user);
      }
    });

    /* ===============================
       CURSOR
    =============================== */
    socket.on("cursor-update", ({ fileId, user, position }) => {
      if (fileId) {
        socket.to(fileId).emit("cursor-update", { user, position });
      }
    });

    /* ===============================
       FILE LOCK
    =============================== */
    socket.on("file-lock", ({ fileId, user }) => {
      if (fileId) {
        io.to(fileId).emit("file-lock-update", {
          fileId,
          lockedBy: user
        });
      }
    });

    /* ===============================
       FILE UNLOCK
    =============================== */
    socket.on("file-unlock", ({ fileId }) => {
      if (fileId) {
        io.to(fileId).emit("file-lock-update", {
          fileId,
          lockedBy: null
        });
      }
    });

    /* ===============================
       ✅ CHAT MESSAGE (FIXED)
    =============================== */
    socket.on("chat-message", async ({ workspaceId, user, text }) => {
      if (!workspaceId || !user || !text?.trim()) return;

      try {
        // 🔥 Save message to DB
        const savedMsg = await ChatMessage.create({
          workspace: workspaceId,
          user,
          text: text.trim(),
        });

        // 🔥 Broadcast to everyone in workspace
        io.to(workspaceId).emit("chat-message", savedMsg);

      } catch (err) {
        console.error("Chat save error:", err);
      }
    });

    /* ===============================
       DISCONNECT
    =============================== */
    socket.on("disconnect", () => {
      for (const [wid, users] of presenceMap.entries()) {
        if (users.has(socket.id)) {
          users.delete(socket.id);

          io.to(wid).emit(
            "presence-update",
            Array.from(users.values())
          );

          if (users.size === 0) {
            presenceMap.delete(wid);
          }
        }
      }
    });

  });
};

/* ===============================
   EMIT ACTIVITY
=============================== */
export const emitActivity = (workspaceId, activity) => {
  if (io) {
    io.to(workspaceId).emit("workspace-activity", activity);
  }
};

export default io;