const express = require("express")

const mealsRouter = express.Router()

//Middlewares
const { mealExist } = require("../middlewares/mealExist.middleware")
const { protectSession } = require("../middlewares/auth.middleware")
const { restaurantExist } = require("../middlewares/restaurantExist.middleware")

//Controllers
const { createMeal, getAllMeals, getMealById, updateMeal, deleteMeal } = require("../controllers/meals.controller")

mealsRouter.post("/:id", protectSession, restaurantExist, createMeal)
mealsRouter.get("/", getAllMeals)
mealsRouter.get("/:id", mealExist, getMealById)
mealsRouter.patch("/:id",protectSession, mealExist, updateMeal)
mealsRouter.delete("/:id", protectSession, mealExist, deleteMeal)

module.exports = { mealsRouter }