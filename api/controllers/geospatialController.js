const fs = require("fs");
const path = require("path");
const Fuse = require("fuse.js");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");

Restaurant.collection.createIndex({ location: "2dsphere" });

const cityPolygonsPath = path.resolve(__dirname, "cityPolygons.json");
const cityPolygons = JSON.parse(fs.readFileSync(cityPolygonsPath, "utf8"));


module.exports = {
  
    getNearbyRestaurants: async (req, res) => {
        try {
            const { latitude, longitude } = req.query;
            if (!latitude || !longitude) {
                return res.status(400).json({ error: 'Latitude and longitude are required for the search.' });
            }
            const userCoordinates = [parseFloat(longitude), parseFloat(latitude)];
            console.time('getNearbyRestaurants'); 
            // Use MongoDB's $nearSphere to find restaurants near the user's location
            const nearbyRestaurants = await Restaurant.find({
                location: {
                    $nearSphere: {
                        $geometry: {
                            type: 'Point',
                            coordinates: userCoordinates,
                        },
                        $maxDistance: 2000, // 5km
                    },
                },
            });
            console.timeEnd('getNearbyRestaurants');
            res.json({ nearbyRestaurants });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

  getIntersectbyRestaurants: async (req, res) => {
    try {
        const routeCoordinates = [
            [106.687398, 10.798662],
            [106.687427, 10.798610],
            [106.6866966, 10.7976848],
            [106.687995, 10.798382],
            [106.68942, 10.7985185],
          ];
      // Truy vấn nhà hàng giao nhau với đoạn đường bằng $geoIntersects
      const nearbyRestaurants = await Restaurant.find({
        location: {
          $geoIntersects: {
            $geometry: {
              type: "LineString",
              coordinates: routeCoordinates,
            },
          },
        },
      });

      res.json({ nearbyRestaurants });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getRestaurantsByPolygon: async (req, res) => {
    try {
      const { cityName } = req.query;
      if (!cityName) {
        return res
          .status(400)
          .json({
            error: "Need name of city or district to required for the search.",
          });
      }

      const normalizedCityName = cityName.toLowerCase().replace(/\s+/g, "");
      

      const fuseOptions = {
        shouldSort: true,
        threshold: 0.4,
        location: 0,   
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ["cityName"],
      };

      const fuse = new Fuse(Object.keys(cityPolygons), fuseOptions);
      const matchingCities = fuse.search(normalizedCityName);

      if (matchingCities.length === 0) {
        return res.status(400).json({ error: "Invalid name." });
      }

      // Chọn thành phố đầu tiên từ kết quả tìm kiếm
      const selectedCity = matchingCities[0].item;

      const cityPolygon = cityPolygons[selectedCity];

      // const cityPolygon = cityPolygons[cityName];

      // if (!cityPolygon) {
      //   return res.status(400).json({ error: 'Invalid name.' });
      // }

      const restaurantsInCity = await Restaurant.find({
        location: {
          $geoWithin: {
            $geometry: cityPolygon,
          },
        },
      });

      const simplifiedRestaurants = restaurantsInCity.map((restaurant) => ({
        location: restaurant.location,
        _id: restaurant._id,
        name: restaurant.name,
        description: restaurant.description,
        image: restaurant.image,
        address: restaurant.address,
        rating: restaurant.rating,
        type: restaurant.type,
        menu: restaurant.menu,
        openingHours: restaurant.openingHours,
        bookingHours: restaurant.bookingHours,
      }));

      res.json(simplifiedRestaurants);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

 
  getRestaurantsInCircle: async (req, res) => {
    try {
      const { latitude, longitude, radius } = req.query;

      if (!latitude || !longitude || !radius) {
        return res
          .status(400)
          .json({
            error:
              "Latitude, longitude, and radius are required for the search.",
          });
      }

      const center = [parseFloat(longitude), parseFloat(latitude)];
      const maxDistance = parseFloat(radius) / 6371;

      const restaurantsInCircle = await Restaurant.find({
        location: {
          $geoWithin: {
            $centerSphere: [center, maxDistance],
          },
        },
      }).select({
        _id: 1,
        name: 1,
        location: 1,
        description: 1,
        image: 1,
        address: 1,
        rating: 1,
        type: 1,
        menu: 1,
        openingHours: 1,
        bookingHours: 1,
      });

      res.json(restaurantsInCircle);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};