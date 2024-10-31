const mongoose = require("mongoose");

const featuredSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    subTitle: {
      type: String,
    },
    name: {
      type: String,
    },
    author: {
      type: String,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    image: {
      type: String,
    },
    restaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
      },
    ],
    layout: {
      type: Number,
      enum: [1, 2, 3,4],
      required: true,
    },
  },
  { timestamps: true }
);

const Featured = mongoose.model("Featured", featuredSchema);

module.exports = Featured;