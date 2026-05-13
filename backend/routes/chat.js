const express = require("express");
const Groq = require("groq-sdk");
const Chat = require("../models/Chat");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message required" });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const botReply = completion.choices?.[0]?.message?.content || "";

    await Chat.create({ userMessage: message, botReply });

    res.json({ success: true, reply: botReply });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
