//Models
const { Meals } = require("../models/meals.model")

//Utils
const { AppError } = require("../utils/appError.util")
const { catchAsync } = require("../utils/catchAsync.util")

const mealExist = catchAsync( async( req, res, next ) => {
    const { id } = req.params

    const meal = await Meals.findOne({ where: { id } })

    if(!meal){
        return next(new AppError("Meal not found", 404))
    }
    req.meal = meal

    next()
})

module.exports = { mealExist }