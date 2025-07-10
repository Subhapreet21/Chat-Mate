const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/api/chat", async (req, res) => {
  try {
    const { parts } = req.body;
    // Forward the parts array directly to Gemini
    const data = {
      contents: [{ parts }],
    };
    const response = await axios.post(GEMINI_URL, data);
    // Extract the response text or image
    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      response.data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ||
      "";
    res.json({ choices: [{ message: { role: "assistant", content: reply } }] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
