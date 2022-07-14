const { body, validationResult } = require("express-validator")

//Utils
const { AppError } = require("../utils/appError.util")

const checkResult = (req, res, next) => {
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        const errorMsgs = errors.array().map(err => err.msg)
        const message = errorMsgs.join(". ")
        return next(new AppError(message, 400))
    }
    next()
}

const createUserValidator = [
    body("name")
        .notEmpty().withMessage("Name cannot be empty"),
    body("email")
        .isEmail().withMessage("Invalid email"),
    body("password")
        .isLength({ min:8 }).withMessage("Password must containt at least 8 character")
        .isAlphanumeric().withMessage("Password should contain both letters and numbers"),
    checkResult
]

const createRestaurantValidator = [
    body("name")
        .notEmpty().withMessage("Please introduce a restauran name"),
    body("address")
        .notEmpty().withMessage("Pleas introduce a valid adress"),
    body("rating")
        .notEmpty().withMessage("Rating is required")
        .isNumeric({max:10}).withMessage("Rating requires only numbers between 1 & 10"),
    checkResult
]

const createMealsValidator = [
    body("name")
        .notEmpty().withMessage("What´s the meal name?"),
    body("price")
        .notEmpty().withMessage("What's it´s price?")
        .isNumeric().withMessage("This field must containt a number"),
]

module.exports = { createUserValidator, createRestaurantValidator, createMealsValidator }