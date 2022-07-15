//Models
const { Meals } = require("../models/meals.model")
const { Orders } = require("../models/orders.model")
const { Restaurants } = require("../models/restaurants.model")

//Utils
const { catchAsync } = require("../utils/catchAsync.util")
const { AppError } = require("../utils/appError.util")

const createOrder = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req
    const { mealId, quantity } = req.body

    const meal = await Meals.findOne({ where: { stauts: "active", id: mealId } })

    const total = meal.price * quantity

    const newOrder = await Orders.create({
        mealId,
        userId: sessionUser.id,
        totalPrice: total,
        quantity
    })

    res.status(201).json({
        status: "sucess",
        newOrder
    })
})

const getAllOrders = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req

    const order = await Orders.findAll({
        where: { userId: sessionUser.id },
        attributes: ["id", "name", "userId", "totalPrice", "quantity", "status"],
        include: [
            { model: Meals,
                attributes: ["id", "name", "price", "restaturantId", "status"],
                include: [
                    { model: Restaurants, 
                        attributes: ["id", "name", "address", "rating", "user"] 
                    }
                ]
            },
        ]
    })

    res.status(201).json({
        status: "sucess",
        order
    })
})

const orderComplete = catchAsync( async( req, res, next ) => {
    const { order, sessionUser } = req

    if(sessionUser.id === order.userId){
        if(order.status === "active"){
            await order.update({ status: "completed" })
        }else{
            return next(new AppError("The order isn´t active", 400))
        }
    }else{
        return next(new AppError("You´re not the order creator", 400))
    }

    res.status(201).json({
        status: "sucess",
        order
    })
})

const cancelOrder = catchAsync( async( req, res, next ) => {
    const { order, sessionUser } = req

    if(sessionUser.id === order.userId){
        if(order.status === "active"){
            await order.update({ status: "cancelled" })
        }else{
            return next(new AppError("The order isn´t active", 400))
        }
    }else{
        return next(new AppError("You´re not the order creator", 400))
    }

    res.status(201).json({
        status: "sucess",
        order
    })
})

module.exports = { createOrder, getAllOrders, orderComplete, cancelOrder }