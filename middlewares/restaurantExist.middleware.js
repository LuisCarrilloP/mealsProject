//Models
const { Restaurants } = require("../models/restaurants.model")

//Utils
const { AppError } = require("../utils/appError.util")
const { catchAsync } = require("../utils/catchAsync.util")

const restaurantExist = catchAsync(async ( req, res, next ) => {
    const { id, restaurantId } = req.params

    const restaurant = await Restaurants.findOne({ where: { id: restaurantId || id, status: "active" } })

    if(!restaurant){
        return next(new AppError("Restaurant not found", 404))
    }
    req.restaurant = restaurant

    next()
})

module.exports = { restaurantExist }