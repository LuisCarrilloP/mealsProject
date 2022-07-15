const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config({ path: "./config.env" })

//Models
const { Users } = require("../models/users.model")
const { Orders } = require("../models/orders.model")
const { Meals } = require("../models/meals.model")
const { Restaurants } = require("../models/restaurants.model")

//Utils
const { catchAsync } = require("../utils/catchAsync.util")
const { AppError } = require("../utils/appError.util")

const createUser = catchAsync( async(req, res, next) => {
    const { name, email, password, role } = req.body

    //Hash password
    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = await Users.create({
        name,
        email,
        password: hashPassword, 
        role
    })
    newUser.password = undefined //removing from the response

    res.status(201).json({
        status: "sucess",
        newUser
    })

})

const login = catchAsync( async( req, res, next ) => {
    const { email, password } = req.body

    //Validar credenciales
    const user = await Users.findOne({ where: { email, status: "active" } })
    if(!user){
        return next(new AppError("Invalid credentials", 401))
    }

    //Validar password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return next(new AppError("Invalid credentials", 401))
    }

    //JWT
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h"})

    res.status(200).json({
        status: "sucess",
        message: "Correct credentials",
        token
    })
})

const getAllUsers = catchAsync(async(req, res, next ) => {

    const users = await Users.findAll({ 
        where: { status: "active" } ,
        attributes: ["id", "name", "email", "status"]
    })

    res.status(200).json({
        status: "sucess",
        users
    })
})

const updateUser = catchAsync( async( req, res, next ) => {
    const { user } = req
    const { name, email } = req.body

    const userUpdated = await user.update({
        name,
        email
    })

    res.status(201).json({
        status: "sucess",
        userUpdated
    })
})

const disableUser = catchAsync( async( req, res, next ) => {
    const { user } = req

    const userDisabled = await user.update({ status: "disable" })

    res.status(204).json({
        status: "sucess",
        message: "User disabled",
        userDisabled
    })
})

const getAllOrdersByUser = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req

    const user = await Users.findOne({
        where: { status: "active", id },
        attributes: ["id", "name", "email", "status", "role"],
        include: [
          {model: Order,
            attributes: ["id","mealId","userId","totalPrice","quantity","status",],
            include: [
              {model: Meal,
                attributes: ["id", "name", "price", "restaurantId", "status"],
                include: [
                  {model: Restaurant,
                    attributes: ["id", "name", "address", "rating", "status"],
                  },
                ],
              },
            ],
          },
        ],
      });

      res.status(200).json({
          status: "sucess",
          user
      })
})

const getOrderByID = catchAsync( async( req, res, next ) => {
    const { order } = req
    
    const orderId = await Orders.findOne({
        where: { status: "active", id: order.id },
        attributes: ["id", "mealId", "userId", "totalPrice", "quantity", "status"],
        include: [
            {model: Meals,
                attributes: ["id", "name", "price", "restaurantId", "status"],
                include: [
                    {model: Restaurants,
                        attributes: ["id", "name", "address", "rating", "status"]
                    }
                ]
            }
        ]
    })

    res.status(200).json({
        status: "sucess",
        orderId
    })
})

module.exports = { createUser, login, getAllUsers, updateUser, disableUser, getAllOrdersByUser, getOrderByID }