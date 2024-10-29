require('dotenv').config({ path: './configs/.env' });
const mongoose = require('mongoose');

const connectedDB = async () => {
    try {
        console.log('MONGO_URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

module.exports = connectedDB;
    