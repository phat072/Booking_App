const mongoose = require("mongoose");


const orderItemSchema = new mongoose.Schema({
  selectedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "suggestionItemSchema", 
  },
});


const orderSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  adults: {
    type: Number,
    required: true,
  },
  children: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  selectedHour: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Chờ xác nhận", "Đã tiếp nhận", "Hoàn thành", "Đã hủy"],
    default: "Chờ xác nhận",
  },
  services: {
    type: String,
    enum: ["Đặt chỗ", "Giao hàng", "Tự đến lấy"],
    default: "Đặt chỗ",
  },
  orderItems: [orderItemSchema],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;