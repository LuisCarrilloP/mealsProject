//Models
const { Meals } = require("../models/meals.model")
const { Restaurants } = require("../models/restaurants.model")

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
    const meals = await Meals.findAll({ 
        where: { status: "active"},
        attributes: ["id", "name", "price", "restaurantId", "status"],
        include: [
            {model: Restaurants, attributes: ["id", "name", "address", "rating", "status"]}
        ]
    })

    res.status(200).json({
        status: "sucess",
        meals
    })
})

const getMealById = catchAsync( async( req, res, next ) => {
    const { meal } = req
    
    const mealId = await Meals.findOne({ 
        where: { id: meal.id, status: "active" },
        attributes: ["id", "name", "price", "restaurantId", "status"],
        include: [
            {model: Restaurants, attributes: ["id", "name", "address", "rating", "status"]}
        ]
    })

    res.status(200).json({
        status: "sucees",
        mealId
    })
})

const updateMeal = catchAsync( async( req, res, next ) => {
    const { meal, sessionUser } = req
    const { name, price } = req.body

    if(sessionUser.role === "admin") {
        await meal.update({ 
            name,
            price 
        });
    } else {
        return next(new AppError("Only admin can modificate", 400));
    }

    res.status(201).json({ 
        status: 'success',
        meal 
    })
})

const deleteMeal = catchAsync( async( req, res, next ) => {
    const { meal, sessionUser } = req

    if(sessionUser.role === "admin"){
        await meal.update({ status: "deleted" })
    }else{
        return next(new AppError("Only admin can delete", 400))
    }
    

    res.status(200).json({
        status: "sucess",
        meal
    })
})

module.exports = { createMeal, getAllMeals, getMealById, updateMeal, deleteMeal }