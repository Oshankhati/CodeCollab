import express from "express";
import auth from "../middlewares/auth.middleware.js";
import ChatMessage from "../models/ChatMessage.js";
import mongoose from "mongoose";

const router = express.Router();


router.get("/:workspaceId", auth, async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;

    // 🔥 FORCE ObjectId conversion
    const messages = await ChatMessage.find({
      workspace: new mongoose.Types.ObjectId(workspaceId),
    })
      .sort({ createdAt: 1 })
      .limit(100);

    console.log("Workspace:", workspaceId);
    console.log("Messages found:", messages.length);

    res.json(messages);
  } catch (err) {
    console.error("Fetch chat error:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
  console.log("Incoming workspaceId:", req.params.workspaceId);
});


router.post("/", auth, async (req, res) => {
  try {
    const { workspace, text } = req.body;
    const user = req.user?.name || "Anonymous";
    
    if (!workspace || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }
    
    const message = await ChatMessage.create({
      workspace,
      user,
      text,
    });
    
    // OPTIONAL: emit socket here later
    res.status(201).json(message);
    
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;