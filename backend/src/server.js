// import app from "./app.js";
// import connectDB from "./config/db.js";
// import { PORT } from "./config/env.js";
// import http from "http";
// import { initSocket } from "./socket/socket.js";

// import dotenv from "dotenv";
// dotenv.config();

// connectDB();

// const server = http.createServer(app);
// initSocket(server);

// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });










// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" }); // ✅ MUST BE FIRST

// import app from "./app.js";
// import connectDB from "./config/db.js";
// import { PORT } from "./config/env.js";
// import http from "http";
// import { initSocket } from "./socket/socket.js";

// // ✅ Connect to DB
// connectDB();

// // ✅ Create HTTP server
// const server = http.createServer(app);

// // ✅ Initialize Socket.IO
// initSocket(server);

// // ✅ Test route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // ✅ Start server
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });








import "./config/dotenv.js"; // ✅ FIRST

import app from "./app.js";
import connectDB from "./config/db.js";
import { PORT } from "./config/env.js";
import http from "http";
import { initSocket } from "./socket/socket.js";

connectDB();

const server = http.createServer(app);
initSocket(server);

app.get("/", (req, res) => {
  res.send("API is running...");
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});