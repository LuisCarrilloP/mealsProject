const express = require("express")

//Middlewares
const { mealExist } = require("../middlewares/mealExist.middleware")
const { protectSession } = require("../middlewares/auth.middleware")
const { restaurantExist } = require("../middlewares/restaurantExist.middleware")
const { createMealsValidator } = require("../middlewares/validators.middleware") 
//Controllers
const { createMeal, getAllMeals, getMealById, updateMeal, deleteMeal } = require("../controllers/meals.controller")

const mealsRouter = express.Router()

mealsRouter.post("/:id", protectSession, restaurantExist, createMealsValidator, createMeal)
mealsRouter.get("/", getAllMeals)
mealsRouter.get("/:id", mealExist, getMealById)
mealsRouter.patch("/:id",protectSession, mealExist, updateMeal)
mealsRouter.delete("/:id", protectSession, mealExist, deleteMeal)

module.exports = { mealsRouter }