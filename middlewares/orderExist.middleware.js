//Models
const { Orders } = require("../models/orders.model")

//Utils
const { catchAsync } = require("../utils/catchAsync.util")
const { AppError } = require("../utils/appError.util")

const orderExist = catchAsync( async( req, res, next ) => {
    const { id } = req.params

    const order = await Orders.findOne({ where: { id } })

    if(!order){
        return next(new AppError("Order not found"))
    }
    req.order = order

    next()
})
module.exports = { orderExist }