//Models
const { Reviews } = require("../models/reviews.model")

//Utils
const { AppError } = require("../utils/appError.util")
const { catchAsync } = require("../utils/catchAsync.util")

const reviewExist = catchAsync( async( req, res, next ) => {
    const { reviewId } = req.params

    const review = await Reviews.findOne({ where: { id: reviewId, status: "active" } })

    if(!review){
        return next(new AppError("Review not found", 404))
    }
    req.review = review

    next()
})

module.exports = { reviewExist }