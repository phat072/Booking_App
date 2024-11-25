const socketIO = require('socket.io');

const socketSetup = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: '*', // Allow all origins for simplicity
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a specific room
    const { chatID, roomName } = socket.handshake.query;

    if (chatID) {
      socket.join(chatID);
      console.log(`User joined chat room: ${chatID}`);
    }

    if (roomName) {
      socket.join(roomName);
      console.log(`User joined room: ${roomName}`);
    }

    // Handle sending messages
    socket.on('send_message', (message) => {
      const { receiverChatID, senderChatID, text, from } = message;

      // Emit message to the receiver's chat room
      io.to(receiverChatID).emit('receive_message', {
        text,
        from,
        senderChatID,
        receiverChatID,
      });
      console.log(`Message sent to room: ${receiverChatID}`);
    });

    // Handle state updates (if needed)
    socket.on('send_state', (data) => {
      const { roomName } = data;
      io.to(roomName).emit('receive_state', data);
      console.log(`State update sent to room: ${roomName}`);
    });

    // Handle disconnects
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      if (chatID) {
        socket.leave(chatID);
        console.log(`User left chat room: ${chatID}`);
      }

      if (roomName) {
        socket.leave(roomName);
        console.log(`User left room: ${roomName}`);
      }
    });
  });
};

module.exports = socketSetup;
