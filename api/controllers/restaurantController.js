const Restaurant = require("../models/restaurant");
const Category = require("../models/category");

module.exports = {
  createRestaurant: async (req, res) => {
    const {
      name,
      description,
      image,
      location: { coordinates }, 
      address,
      rating,
      type,
      promotions,
      imagePrice,
      album,
      openingHours,
      bookingHours,
      suggestions
    } = req.body;

    try {
      // Check if the category exists
      const category = await Category.findById(type);
      if (!category) {
        return res.status(400).json({ message: "Loại nhà hàng không hợp lệ" });
      }

      const newRestaurant = new Restaurant({
        name,
        description,
        image,
        location: {
          type: "Point", 
          coordinates, 
        },
        address,
        rating,
        type,
        promotions,
        imagePrice,
        album,
        openingHours,
        bookingHours,
        suggestions 
      });

      const savedRestaurant = await newRestaurant.save();
      res.status(201).json(savedRestaurant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateRestaurant: async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const updateFields = req.body; // Lấy tất cả các trường cần cập nhật từ req.body

    try {
      // Kiểm tra nếu type (loại nhà hàng) được cung cấp, hãy xác minh nó
      if (updateFields.type) {
        const category = await Category.findById(updateFields.type);
        if (!category) {
          return res.status(400).json({ message: "Loại nhà hàng không hợp lệ" });
        }
      }

      // Nếu có trường location, hãy xử lý riêng lẻ
      if (updateFields.location && updateFields.location.coordinates) {
        updateFields.location.type = "Point";
      }

      // Cập nhật nhà hàng với các trường được cung cấp
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        restaurantId,
        { $set: updateFields }, // Sử dụng $set để chỉ cập nhật các trường được cung cấp
        { new: true } // Trả về bản ghi mới sau khi cập nhật
      );

      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Nhà hàng không tồn tại" });
      }

      res.status(200).json(updatedRestaurant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteRestaurant: async (req, res) => {
    const restaurantId = req.params.restaurantId;

    try {
      const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

      if (!deletedRestaurant) {
        return res.status(404).json({ message: "Nhà hàng không tồn tại" });
      }

      res.status(200).json({ message: "Xóa nhà hàng thành công", restaurant: deletedRestaurant });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  addSuggestion: async (req, res) => {
    const { restaurantId } = req.params;
    const { title } = req.body;

    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Nhà hàng không tồn tại" });
      }

      restaurant.suggestions.push({ title, items: [] });
      const updatedRestaurant = await restaurant.save();

      res.status(200).json(updatedRestaurant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  addComboOrMeal: async (req, res) => {
    const restaurantId = req.params.restaurantId;
    const suggestionId = req.params.suggestionId;
    const { image, title,subTitle, description,note, originalPrice, discountedPrice, discountPercentage, highLight } = req.body;

    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Nhà hàng không tồn tại" });
      }

      const suggestion = restaurant.suggestions.id(suggestionId);
      if (!suggestion) {
        return res.status(404).json({ message: "Không tìm thấy đề xuất" });
      }
      
      suggestion.items.push({ image, title, subTitle, description, note, originalPrice, discountedPrice, discountPercentage, highLight });
      await restaurant.save();

      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.find().populate("type"); // Sử dụng populate để lấy thông tin từ bảng Category
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getRestaurantsByCategory: async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
      // Lấy danh sách nhà hàng dựa trên ID của category
      const restaurants = await Restaurant.find({ type: categoryId });
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  searchRestaurants: async (req, res) => {
    const { keyword } = req.params;

    try {
      const restaurants = await Restaurant.find({
        name: { $regex: new RegExp(keyword, "i") },
      }).populate("type");

      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getRestaurantsById: async (req, res) => {
    try {
      const restaurantId = req.params.restaurantId;
      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({ message: "Khong tim thay nha hang" });
      }

      res.status(200).json({ message: "thanh cong", restaurant });
    } catch (error) {
      console.error("loi khong lay duoc data nha hang", error);
      res.status(500).json({ message: "loi server" });
    }
  },
};