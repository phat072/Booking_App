const mongoose = require('mongoose');


const suggestionItemSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subTitle : {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  note : {
    type: [String],
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number,
  },
  discountPercentage: {
    type: Number,
  },
  highLight : {
    type: String,
    required: true
  }
});

const suggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  items: [suggestionItemSchema]
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  image: {
    type: String ,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere',
    }
  },
  address: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  promotions : {
    type : String, 
    default: 'Đặt bàn giữ chỗ', 
  },
  imagePrice: [
    {
      image: {
        type: String,
      }
    }
  ],
  album: [
    {
      image: {
        type: String,
      }
    }
  ],
  openingHours: {
    type: String 
  },
  bookingHours: [{
    type: String,
    required: true,
  }],
  suggestions: [suggestionSchema],
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;

// post: http://localhost:8000/restaurants

// Test postman

// {
//   "name": "Sample Restaurant",
//   "description": "A wonderful place to enjoy delicious food.",
//   "image": "https://example.com/sample-restaurant-image.jpg",
//   "location": {
//     "type": "Point",
//     "coordinates": [106.7184612, 10.8275828]
//   },
//   "address": "123 Main Street, Cityville",
//   "rating": 4.5,
//   "type": "65824e7b55ac0795434e8c8d", // Replace with the actual ObjectId of the category
//   "menu": [
//     {
//       "image": "https://example.com/menu-item1.jpg"
//     },
//     {
//       "image": "https://example.com/menu-item2.jpg"
//     }
//   ],
//   "openingHours": "9:00 AM - 10:00 PM",
//   "bookingHours": ["12:00 PM", "1:00 PM", "7:00 PM"]
// }