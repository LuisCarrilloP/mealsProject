//Models
const { Meals } = require("../models/meals.model")

//Utils
const { AppError } = require("../utils/appError.util")
const { catchAsync } = require("../utils/catchAsync.util")

const createMeal = catchAsync( async( req, res, next ) => {
    const { restaurant } = req
    const { name, price } = req.body

    const newMeal = await Meals.create({
        name,
        price,
        restaurantId: restaurant.id
    })

    res.status(201).json({
        staus: "sucess",
        newMeal
    })
})

const getAllMeals = catchAsync( async( req, res, next ) => {
    const meals = await Meals.findAll({ where: { status: "active"} })

    res.status(200).json({
        status: "sucess",
        meals
    })
})

const getMealById = catchAsync( async( req, res, next ) => {
    const { meal } = req
    
    const mealI = await Meals.findOne({ where: { id: meal.id, status: "active" } })

    if(!mealI){
        return new AppError("Not meal found with this id", 404)
    }

    res.status(200).json({
        status: "sucees",
        mealI
    })
})

const updateMeal = catchAsync( async( req, res, next ) => {
    const { meal } = req
    const { name, price } = req.body
    
    const mealU = await meal.update({
        name,
        price
    })

    res.status(204).json({
        status: "sucess",
        mealU
    })
})

const deleteMeal = catchAsync( async( req, res, next ) => {
    const { meal } = req

    const mealD = await meal.update({
        status: "deleted"
    })

    res.status(200).json({
        status: "sucess",
        mealD
    })
})

module.exports = { createMeal, getAllMeals, getMealById, updateMeal, deleteMeal }