const Order = require("../models/order");
const Restaurant = require("../models/restaurant");
const User = require("../models/user");

module.exports = {
    placeOrder : async (req, res) => {
        try {
            const {restaurantId, userId, adults, children, date, selectedHour, note, selectedItem} = req.body;
            const restaurant = await Restaurant.findById(restaurantId);
            const user = await User.findById(userId);

            if(!restaurant || !user) {
                return res.status(404).json({message: "Restaurant not found"});
            }
            const order = new Order({
                restaurant: restaurantId,
                user: userId,
                adults,
                children,
                date,
                selectedHour,
                note,
                status: "Chờ xác nhận",
                services: "Đặt chỗ",
            });
            if (selectedItem) {
                order.orderItems.push({ selectedItem });
            }
            await order.save();
            const updatedBookingHours = restaurant.bookingHours.filter(hour => hour !== selectedHour);
            restaurant.bookingHours = updatedBookingHours;
            await restaurant.save();
            res.status(201).json({message: "Order placed successfully", order});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Internal server error"});
        }
    },

    getOrderByUser : async (req, res) => {
        try {
            const {userId} = req.params;
            const user = await User.findById(userId);
            if(!user) {
                return res.status(404).json({message: "User not found"});
            }
            const orders = await Order.find({user: userId}).populate("restaurant");
            res.status(200).json({orders});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Internal server error"});
        }
    },

    getAllOrders : async (req, res) => {
        try {
            const orders = await Order.find().populate("restaurant").populate("user");
            res.status(200).json({orders});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Internal server error"});
        }
    },

    updateOrderStatus : async (req, res) => {
        try {
            const {orderId} = req.params;
            const updatedFields = req.body;
    
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({message: "Order not found"});
            }

            Object.keys(updatedFields).forEach(key => {
                order[key] = updatedFields[key];
            });
            await order.save();

            res.status(200).json({message: "Order updated successfully", order});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Internal server error"});
        }   
    }

}