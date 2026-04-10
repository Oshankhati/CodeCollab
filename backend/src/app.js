import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import fileRoutes from "./routes/file.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import versionRoutes from "./routes/version.routes.js";
import explainRoutes from "./routes/explain.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import runRoute from "./routes/run.route.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/versions", versionRoutes);
app.use("/api/explain", explainRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", runRoute);

export default app;