import app from "./app.js";
import connectDB from "./config/db.js";
import { PORT } from "./config/env.js";
import http from "http";
import { initSocket } from "./socket/socket.js";

connectDB();

const server = http.createServer(app);
initSocket(server);

app.get('/', (req, res) => {
  res.send('API is running...');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});