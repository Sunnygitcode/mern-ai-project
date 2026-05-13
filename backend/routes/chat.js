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

    // MODEL OPTIONS (Aap niche diye gaye teen options me se koi bhi string copy-paste kar sakte hain):
    // 1. "llama-3.3-70b-versatile" -> Subse advanced reasoning aur smart logic ke liye [Meta Llama 3.3]
    // 2. "llama3-8b-8192"          -> Subse tez speed aur production stability ke liye [Llama Tiers]
    // 3. "gemma2-9b-it"            -> Google ka high quality optimized fast text layer model

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // UPDATED: Latest free-tier flagship versatile model configured
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const botReply = completion.choices?.[0]?.message?.content || "";

    // MongoDB Mongoose cluster entry structure synchronization
    await Chat.create({ userMessage: message, botReply });

    res.json({ success: true, reply: botReply });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
