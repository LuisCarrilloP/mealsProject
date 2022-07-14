const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config({ path: "./config.env" })

//Models
const { Users } = require("../models/users.model")
const { Orders } = require("../models/orders.model")

//Utils
const { catchAsync } = require("../utils/catchAsync.util")
const { AppError } = require("../utils/appError.util")

const createUser = catchAsync( async(req, res, next) => {
    const { name, email, password, rol} = req.body

    //Hash password
    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = await Users.create({
        name,
        email,
        password: hashPassword, 
        rol
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
        return next(new AppError("Invalid credentials", 404))
    }

    //Validar password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return next(new AppError("Invalid credentials", 404))
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
        attributes: ["id", "name", "email", "status"],
        where: { status: "active" } })

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

    const userDisabled = await user.update({ status: "deleted" })

    res.status(204).json({
        status: "sucess",
        message: "User disabled",
        userDisabled
    })
})

const getAllOrdersByUser = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req

    const orders =  await Orders.findAll({ where: { userId: sessionUser.id } })

    if(!orders){
        return new AppError("User haven't created any orders yet", 400)
    }

    res.status(200).json({
        status: "sucess",
        orders
    })
})

const getOrderByID = catchAsync( async( req, res, next ) => {
    const { sessionUser } = req
    const { id } = req.params
    const order = await Orders.findAll({ where: { id} })

    if(!order){
        return new AppError(`No order founded with id ${id}`, 404)
    }

    res.status(200).json({
        status: "sucess",
        order
    })
})

module.exports = { createUser, login, getAllUsers, updateUser, disableUser, getAllOrdersByUser, getOrderByID }