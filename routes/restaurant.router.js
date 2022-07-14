const express = require("express")

const restaurantRouter = express.Router()

//Middlewares
const { restaurantExist } = require("../middlewares/restaurantExist.middleware")
const { reviewExist} = require("../middlewares/reviewExist.middleware")
const { protectSession } = require("../middlewares/auth.middleware")

//Controllers
const { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, disableRestaurant, reviewRestaurant, updateReview, deleteReview } = require("../controllers/restaurant.controller")

restaurantRouter.post("/", protectSession, createRestaurant)
restaurantRouter.get("/", getAllRestaurants)
restaurantRouter.get("/:id", restaurantExist, getRestaurantById)
restaurantRouter.patch("/:id", protectSession, restaurantExist, updateRestaurant)
restaurantRouter.delete("/:id", protectSession, restaurantExist, disableRestaurant)
restaurantRouter.post("/reviews/:restaurantId", protectSession, reviewRestaurant)
restaurantRouter.patch("/reviews/:id",protectSession, reviewExist, updateReview)
restaurantRouter.delete("/reviews/:id",protectSession, reviewExist, deleteReview)

module.exports = { restaurantRouter }