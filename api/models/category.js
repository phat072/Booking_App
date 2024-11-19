const mongoose = require('mongoose');

const nameEnum = ['Buffet', 'Lẩu', 'Nướng', 'Hải Sản', 'Món Hàn', 'Món Nhật', 'Món Việt', 'Món Chay', 'Món Âu'];
const imgEnum = [
    '../../assets/img/buffet.jpg',
    '../../assets/img/hot-pot.png',
    '../../assets/img/barbecue.jpg',
    '../../assets/img/lobster.jpg',
    '../../assets/img/soju.jpg',
    '../../assets/img/noodle.jpg',
    '../../assets/img/noodle-2.jpg',
    '../../assets/img/salad.jpg',
    '../../assets/img/steak.jpg',
    'https://cdn-icons-png.flaticon.com/512/6454/6454454.png',
    "https://cdn-icons-png.flaticon.com/512/3183/3183463.png",
    "https://cdn-icons-png.flaticon.com/512/1699/1699834.png",
    "https://cdn-icons-png.flaticon.com/512/5821/5821460.png",
    "https://cdn-icons-png.flaticon.com/512/2714/2714023.png",
    "https://cdn-icons-png.flaticon.com/512/2510/2510376.png",
    "https://cdn-icons-png.flaticon.com/512/2515/2515183.png",
    "https://cdn-icons-png.flaticon.com/512/856/856113.png",
    "https://cdn-icons-png.flaticon.com/512/3808/3808804.png",
];

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: nameEnum,
    },
    image: {
        type: String,
        enum: imgEnum,
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
