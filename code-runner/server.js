import express from "express";
import cors from "cors";
import runRoute from "./routes/run.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/run", runRoute);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`🚀 Code Runner running on port ${PORT}`);
});