const mongoose = require('mongoose');

const nameEnum = ['Buffet', 'Lẩu', 'Nướng', 'Hải Sản', 'Món Hàn', 'Món Nhật', 'Món Việt', 'Món Chay', 'Món Âu'];
// const imgEnum =
//     [
//         '../../assets/img/buffet.jpg',
//         '../../assets/img/hot-pot.png',
//         '../../assets/img/barbecue.jpg',
//         '../../assets/img/lobster.jpg',
//         '../../assets/img/soju.jpg',
//         '../../assets/img/noodle.jpg',
//         '../../assets/img/noodle-2.jpg',
//         '../../assets/img/salad.jpg',
//         '../../assets/img/steak.jpg',
//     ];
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