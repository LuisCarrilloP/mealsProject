const express = require("express")

//Middlewares
const { restaurantExist } = require("../middlewares/restaurantExist.middleware")
const { reviewExist} = require("../middlewares/reviewExist.middleware")
const { protectSession } = require("../middlewares/auth.middleware")
const { createRestaurantValidator, createReviewValidator } = require("../middlewares/validators.middleware")

//Controllers
const { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, disableRestaurant, reviewRestaurant, updateReview, deleteReview } = require("../controllers/restaurant.controller")

const restaurantRouter = express.Router()

restaurantRouter.get("/", getAllRestaurants)
restaurantRouter.get("/:id", restaurantExist, getRestaurantById)
restaurantRouter.post("/", protectSession, createRestaurantValidator, createRestaurant)
restaurantRouter.patch("/:id", protectSession, restaurantExist, updateRestaurant)
restaurantRouter.delete("/:id", protectSession, restaurantExist, disableRestaurant)
restaurantRouter.post("/reviews/:restaurantId", protectSession, createReviewValidator, restaurantExist, reviewRestaurant)
restaurantRouter.patch("/reviews/:id",protectSession, reviewExist, updateReview)
restaurantRouter.delete("/reviews/:id",protectSession, reviewExist, deleteReview)

module.exports = { restaurantRouter }