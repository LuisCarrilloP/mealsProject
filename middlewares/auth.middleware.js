const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
//Models
const { Users } = require("../models/users.model")

//Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util")

dotenv.config({ path: "./config.env"})

const protectSession = catchAsync(async( req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }

    if(!token){
        next(new AppError("Invalid token", 403))
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET)

    const user = await Users.findOne({ where: { id: decoded.id, status: "active" }})
    if(!user){
        return next(new AppError("The owner of this token doesnt exist anymore", 403))
    }
    req.sessionUser = user

    next()
})

const protectUserAccount = (req, res, next) => {
    const { sessionUser, user } = req
    /* const { id } = req.params */

    if(sessionUser.id !== user.id){
        return next(new AppError("You do not own this account", 403))
    }

    next()
}

module.exports = { protectSession, protectUserAccount }