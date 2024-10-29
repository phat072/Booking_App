const express = require('express');
const connectedDB = require('./configs/database'); 

const app = express();

connectedDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the application!');
});

const mongoose = require('mongoose');

// Tạo một schema mẫu
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model('User', userSchema);

// Tạo và lưu người dùng mới
const addSampleData = async () => {
    const sampleUser = new User({ name: 'Phát', email: 'phat@example.com' });
    await sampleUser.save();
    console.log('Dữ liệu mẫu đã được thêm vào MongoDB');
};

addSampleData();
