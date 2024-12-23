const User = require("../models/user");
const Message = require("../models/message");

const userSocketMap = require("../sockets/socketSetup");

module.exports = {
    SendRequest : async (req, res) => {
      const {senderId, receiverId, message} = req.body;

      console.log(senderId);
      console.log(receiverId);
      console.log(message);
      const request = {
        from: senderId, 
        message,
        requestId: new mongoose.Types.ObjectId()  // Add a unique requestId here if needed
      };
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({message: 'Receiver not found'});
      }
    

      receiver.requests.push(request);
      receiver.requests.push({from: senderId, message});
      await receiver.save();
    
      res.status(200).json({message: 'Request sent succesfully'});
    },
    GetRequests : async (req, res) => {
      try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate(
          'requests.from',
          'name email image',
        );
    
        if (user) {
          res.json(user.requests);
        } else {
          res.status(400);
          throw new Error('User not found');
        }
      } catch (error) {
        console.log('error', error);
      }
    },
    AcceptRequest : async (req, res) => {
      try {
        const {userId, requestId} = req.body;

        console.log('userId', userId);
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({message: 'User not found'});
        }
    
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $pull: {requests: {from: requestId}},
          },
          {new: true},
        );
    
        if (!updatedUser) {
          return res.status(404).json({message: 'Request not found'});
        }
    
        await User.findByIdAndUpdate(userId, {
          $push: {friends: requestId},
        });
    
        const friendUser = await User.findByIdAndUpdate(requestId, {
          $push: {friends: userId},
        });
    
        if (!friendUser) {
          return res.status(404).json({message: 'Friend not found'});
        }
    
        res.status(200).json({message: 'Request accepted sucesfully'});
      } catch (error) {
        console.log('Error', error);
        res.status(500).json({message: 'Server Error'});
      }
    },
    SendMessage : async (req, res) => {
      try {
        const {senderId, receiverId, message} = req.body;
    
        const newMessage = new Message({
          senderId,
          receiverId,
          message,
        });
    
        await newMessage.save();
    
        const receiverSocketId = userSocketMap[receiverId];
    
        if (receiverSocketId) {
          console.log('emitting recieveMessage event to the reciver', receiverId);
          io.to(receiverSocketId).emit('newMessage', newMessage);
        } else {
          console.log('Receiver socket ID not found');
        }
    
        res.status(201).json(newMessage);
      } catch (error) {
        console.log('ERROR', error);
      }
    },
    GetMessages: async (req, res) => {
      try {
        const { userId, friendId } = req.params;
        console.log('userId', userId);
        console.log('friendId', friendId);
        if (!userId || !friendId) {
          return res.status(400).json({ error: "Missing userId or friendId" });
        }
    
        const messages = await Message.find({
          $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
          ],
        });
    
        res.json(messages);
      } catch (error) {
        console.log('ERROR', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
      }
    },    
  };