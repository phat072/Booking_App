const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  avatar: {
    type: String,
    required: false,
  },
  mobileNo: {
    type: String,
    required: false,
  },
  street: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  occupation: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  favoriteRestaurants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  ],
  // phan quyen 
  admin: {
    type: Boolean,
    default: false,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;