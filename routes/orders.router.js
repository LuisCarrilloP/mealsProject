const express = require("express")

//Controllers
const { createOrder, getAllOrders, orderComplete, cancelOrder } = require("../controllers/orders.controller")

//Middlewares
const { mealExist } = require("../middlewares/mealExist.middleware")
const { orderExist } = require("../middlewares/orderExist.middleware")
const { protectSession } = require("../middlewares/auth.middleware")
const { createOrderValidator } = require("../middlewares/validators.middleware")

const ordersRouter = express.Router()

ordersRouter.post("/", protectSession, mealExist, createOrderValidator, createOrder)
ordersRouter.get("/me", protectSession, getAllOrders)
ordersRouter.patch("/:id", protectSession, orderExist, orderComplete)
ordersRouter.delete("/:id", protectSession, orderExist, cancelOrder)

module.exports = { ordersRouter }