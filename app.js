const express = require("express")
const rateLimit = require("express-rate-limit")

//Routers
const { usersRouter } = require("./routes/users.router")
const { mealsRouter } = require("./routes/meals.router")
const { restaurantRouter } = require("./routes/restaurant.router")
const { ordersRouter } = require("./routes/orders.router")

//GlobalError
const { globalErrorHandler } = require("./controllers/globalErrorHandler.controller")

//Utils
const { AppError } = require("./utils/appError.util")

//Init
const app = express()

//Allow json
app.use(express.json())

//Limit the number of requests
const limiter = rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,//1hr
    message: "Number of requests have been exceeded"
})
app.use(limiter)

//Endpoints
app.use("/api/v1/users", usersRouter)
app.use("/api/v1/meals", mealsRouter)
app.use("/api/v1/restaurants", restaurantRouter)
app.use("/api/v1/orders", ordersRouter)

//Listen requests even wrong ones
app.all("*", (req, res, next) => {
    next(new AppError(`${req.method} ${req.originalUrl} not found in this server`, 404))
})

//Global error handler
app.use( globalErrorHandler )

module.exports = { app }

