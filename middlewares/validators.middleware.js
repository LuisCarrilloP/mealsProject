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
        .notEmpty().withMessage("Name cannot be empty")
        .isString().withMessage("Name must be a string"),
    body("email")
        .isEmail().withMessage("Invalid email"),
    body("password")
        .isLength({ min:8 }).withMessage("Password must containt at least 8 character")
        .isAlphanumeric().withMessage("Password should contain both letters and numbers"),
    body("role")
        .notEmpty().withMessage("Role cannot be empty")
        .isString().withMessage("Role must be a string only"),
    checkResult
]

const createRestaurantValidator = [
    body("name")
        .notEmpty().withMessage("Please introduce a restauran name")
        .isString().withMessage("Name must be a string"),
    body("address")
        .notEmpty().withMessage("Pleas introduce a valid adress")
        .isString().withMessage("Address must be a string"),
    body("rating")
        .notEmpty().withMessage("Rating is required")
        .isNumeric().withMessage("Rating requires only numbers between 1 & 10"),
    checkResult
]

const createMealsValidator = [
    body("name")
        .notEmpty().withMessage("What´s the meal name?")
        .isString().withMessage("Name must be a string"),
    body("price")
        .notEmpty().withMessage("What's it´s price?")
        .isNumeric().withMessage("This field must containt a number"),
    checkResult
]

const createOrderValidator = [
    body("mealId")
        .notEmpty().withMessage("Please provide a mealId")
        .isNumeric().withMessage("mealId is not a number"),
    body("quantity")
        .notEmpty().withMessage("Please provide a quantity")
        .isNumeric().withMessage("quantity is not a number"),
    checkResult
]

const createReviewValidator = [
    body('comment')
        .notEmpty().withMessage('Comment cannot be empty')
        .isString().withMessage('Comment must be a string'),
  body('rating')
        .notEmpty().withMessage('Rating cannot be empty')
        .isNumeric().withMessage('Rating is not a number'),
  checkResult,
]

module.exports = { createUserValidator, createRestaurantValidator, createMealsValidator, createOrderValidator,createReviewValidator }