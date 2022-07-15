const express = require("express")

//Controllers
const { createUser, login, getAllUsers, updateUser, disableUser, getAllOrdersByUser, getOrderByID } = require("../controllers/users.controller")

//Middlewares
const { createUserValidator } = require("../middlewares/validators.middleware")
const { userExists } = require("../middlewares/userExist.middleware")
const { orderExist } = require("../middlewares/orderExist.middleware")
const { protectSession, protectUserAccount } = require("../middlewares/auth.middleware")

const usersRouter = express.Router()

usersRouter.post("/signup", createUserValidator, createUser )
usersRouter.post("/login", login )
usersRouter.get("/", protectSession, getAllUsers)
usersRouter.patch("/:id",protectSession, userExists, protectUserAccount, updateUser)
usersRouter.delete("/:id",protectSession, userExists, protectUserAccount, disableUser)
usersRouter.get("/orders",protectSession, getAllOrdersByUser )
usersRouter.get("/orders/:id", protectSession, orderExist, getOrderByID)

module.exports = { usersRouter }
