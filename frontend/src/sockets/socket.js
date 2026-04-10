// import { io } from "socket.io-client";
// import { BASE_URL } from "../api/base";

// export const socket = io(BASE_URL);

import { io } from "socket.io-client";
import { BASE_URL } from "../api/base";

export const socket = io(BASE_URL, {
  transports: ["websocket"],   // faster + stable
  autoConnect: true,           // ensure auto connect
  reconnection: true,          // reconnect if lost
  reconnectionAttempts: 5,
});

// ✅ Debug logs (VERY IMPORTANT)
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});