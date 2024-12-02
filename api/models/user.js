const mongoose = require("mongoose");
const { roles } = require('../configs/roles');
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
  role: {
    type: String,
    enum: roles,
    default: 'user',
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
  requests: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

// Pre-save middleware to set the role based on the admin field
userSchema.pre('save', function (next) {
  if (this.admin) {
    this.role = 'admin';
  } else {
    this.role = 'user';
  }
  next();
});


const User = mongoose.model("User", userSchema);

module.exports = User;