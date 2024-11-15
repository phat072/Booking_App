const Featured = require("../models/featured");

module.exports = {
    getFeatured: async (req, res) => {
        try {
            const featuredData = await Featured.find().populate("restaurants");
            res.json(featuredData);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createFeatured: async (req, res) => {
        const { title, subTitle, author, name, description, image, restaurants, layout } = req.body;

        // Log giá trị nhận được từ request
        console.log("Request body:", req.body);

        try {
            const newFeatured = await Featured.create({
                title,
                subTitle,
                author,
                name,
                description,
                image,
                restaurants,
                layout, // Đảm bảo layout được truyền vào đây
            });

            // Log giá trị sau khi tạo
            console.log("New featured created:", newFeatured);

            res.status(201).json(newFeatured);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    updateFeatured: async (req, res) => {
        const { id } = req.params;
        const updates = req.body;
        
        console.log("Request body:", updates);

        try {
            const updatedFeatured = await Featured.findByIdAndUpdate(id, updates, {
                new: true, // Return the updated document
                runValidators: true, // Ensure the updates are valid based on the schema
            });

            if (!updatedFeatured) {
                return res.status(404).json({ message: "Featured not found" });
            }

            console.log("Updated featured:", updatedFeatured);

            res.json(updatedFeatured);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};