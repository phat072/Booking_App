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
          senderId,
          message,
        });
      }
    });
  });
};

module.exports = socketSetup;
