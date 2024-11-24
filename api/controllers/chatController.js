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
  try {
    const { userId, text, recipientId } = req.body;

    // Validate required fields
    if (!userId || !text || !recipientId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ error: "Invalid userId or recipientId" });
    }

    // Validate users exist
    const sender = await User.findById(userId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(400).json({ error: "Sender or recipient does not exist" });
    }

    // Create a new chat message
    const newChat = new Chat({
      userId,
      text,
      recipientId,
    });

    // Save the chat message to the database
    const savedChat = await newChat.save();

    res.status(201).json({ message: "Chat message posted successfully", chat: savedChat });
  } catch (error) {
    console.error("Error saving chat message:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};


module.exports = postChatMessage;


module.exports = {
  getAllChats,
  getUserChats,
  postChatMessage,
};