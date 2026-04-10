import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    const { code, language, input } = req.body;

    const response = await axios.post("http://13.51.197.142:5001/run", {
      code,
      language,
      input,
    });

    res.json(response.data);

  } catch (err) {
    res.status(500).json({
      error: err.response?.data?.error || "Execution failed",
    });
  }
});

export default router;