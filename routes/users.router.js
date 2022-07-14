const express = require("express")

//Controllers
const { createUser, login, getAllUsers, updateUser, disableUser, getAllOrdersByUser, getOrderByID } = require("../controllers/users.controller")

//Middlewares
const { createUserValidator } = require("../middlewares/validators.middleware")
const { userExists } = require("../middlewares/userExist.middleware")
const { protectSession, protectUserAccount } = require("../middlewares/auth.middleware")

const usersRouter = express.Router()

usersRouter.post("/signup", createUserValidator, createUser )
usersRouter.post("/login", login )
usersRouter.get("/", protectSession, getAllUsers)
usersRouter.patch("/:id",protectSession, userExists, protectUserAccount, updateUser)
usersRouter.delete("/:id",protectSession, userExists, protectUserAccount, disableUser)
usersRouter.get("/orders", getAllOrdersByUser )
usersRouter.get("/orders/:id", protectSession, getOrderByID)

module.exports = { usersRouter }
