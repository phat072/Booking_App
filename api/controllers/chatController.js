const Chat = require("../models/chat");

// Fetch all chat messages for the admin
const getAllChats = async (req, res) => {
  try {
    const messages = await Chat.find().sort({ createdAt: -1 }).populate('userId', 'name email').populate('recipientId', 'name email');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
};

// Fetch chat messages for a specific user
const getUserChats = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Chat.find({
      $or: [
        { userId },
        { recipientId: userId }
      ]
    }).sort({ createdAt: 1 }).populate('userId', 'name email').populate('recipientId', 'name email');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
};

// Post a new chat message
const postChatMessage = async (req, res) => {
  const { userId, text, createdAt, recipientId } = req.body;

  try {
    const message = new Chat({
      userId,
      text,
      createdAt,
      recipientId
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to send chat message" });
  }
};

module.exports = {
  getAllChats,
  getUserChats,
  postChatMessage,
};