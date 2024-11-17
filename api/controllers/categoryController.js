const Category = require("../models/category");

module.exports = {
  createCategory: async (req, res) => {
    try {
        // Assuming that the request body contains 'name' and 'image'
        const { name, image } = req.body;
    
        // Create a new category instance
        const newCategory = new Category({
          name,
          image,
        });
    
        // Save the new category to the database
        const savedCategory = await newCategory.save();
    
        // Respond with the saved category
        res.status(201).json(savedCategory);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  },

  getAllCategories: async (req, res) => {
    try {
        // Fetch all categories from the database
        const categories = await Category.find();
    
        // Respond with the list of categories
        res.status(200).json(categories);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  },
};