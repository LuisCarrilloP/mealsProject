const express = require("express")

//Routers
const { usersRouter } = require("./routes/users.router")
const { mealsRouter } = require("./routes/meals.router")
const { restaurantRouter } = require("./routes/restaurant.router")

//GlobalError
const { globalErrorHandler } = require("./controllers/globalErrorHandler.controller")

//Utils
const { AppError } = require("./utils/appError.util")

//Init
const app = express()

//Allow json
app.use(express.json())

//Endpoints
app.use("/api/v1/users", usersRouter)
app.use("/api/v1/meals", mealsRouter)
app.use("/api/v1/restaurants", restaurantRouter)

//Listen requests even wrong ones
app.all("*", (req, res, next) => {
    next(new AppError(`${req.method} ${req.originalUrl} not found in this server`, 404))
})

//Global error handler
app.use( globalErrorHandler )

module.exports = { app }

