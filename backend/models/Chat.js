const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userMessage: { type: String },
    botReply: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema, "Chatbot@123");
