<<<<<<< HEAD
const http = require('http')
const socketSetup = (server) => {
  const io = require('socket.io')(http);
  //{"userId" : "socket ID"}

  const userSocketMap = {};

  io.on('connection', socket => {
    console.log('a user is connected', socket.id);

    const userId = socket.handshake.query.userId;

    console.log('userid', userId);

    if (userId !== 'undefined') {
      userSocketMap[userId] = socket.id;
    }

    console.log('user socket data', userSocketMap);

    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
      delete userSocketMap[userId];
    });

    socket.on('sendMessage', ({senderId, receiverId, message}) => {
      const receiverSocketId = userSocketMap[receiverId];

      console.log('receiver Id', receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', {
=======
const socketSetup = (io) => {
  const userSocketMap = {}; // Mapping of userId to socketId

  io.on("connection", (socket) => {
    console.log("a user is connected", socket.id);

    // Get userId from the query string
    const userId = socket.handshake.query.userId;
    console.log("UserID:", userId);

    if (userId && userId !== "undefined") {
      userSocketMap[userId] = socket.id;
    }

    console.log("User socket data:", userSocketMap);

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
      delete userSocketMap[userId];
    });

    // Handle sending a message
    socket.on("SendMessage", ({ senderId, receiverId, message }) => {
      const receiverSocketId = userSocketMap[receiverId];
      console.log("Receiver Id:", receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
>>>>>>> ee53205 (Mô tả thay đổi)
          senderId,
          message,
        });
      }
    });
  });
};

module.exports = socketSetup;
