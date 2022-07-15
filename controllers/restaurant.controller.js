//Models
const { Restaurants } = require("../models/restaurants.model")
const { Reviews } = require("../models/reviews.model")

//Utils
const { catchAsync } = require("../utils/catchAsync.util")
const { AppError } = require("../utils/appError.util")

const createRestaurant = catchAsync( async( req, res, next )  => {
    const { name, address, rating } = req.body

    const newRestaurant = await Restaurants.create({
        name,
        address,
        rating
    })

    res.status(201).json({
        status: "sucess",
        newRestaurant
    })
})

const getAllRestaurants = catchAsync( async( req, res, next ) => {
    const restaurants = await Restaurants.findAll({ 
        where: { status: "active" },
        attributes: ["id", "name", "address", "rating", "status"],
        include: [
            {model: Reviews, attributes: ["id", "userId", "comment", "restaurantId", "rating", "status"]}
        ]
    })

    res.status(200).json({
        status: "sucess",
        restaurants
    })
})

const getRestaurantById = catchAsync( async( req, res, next ) => {
    const { restaurant } = req

    const restaurantId = await Restaurants.findOne({ 
        where: { id: restaurant.id, status: "active" },
        attributes: ["id", "name", "address", "rating", "status"],
        include: [
            {model: Reviews, attributes: ["id", "userId", "comment", "restaurantId", "rating", "status"]}
        ]
    })
    
    res.status(200).json({
        status: "sucess",
        restaurantId
    })
})

const updateRestaurant = catchAsync( async( req, res, next ) => {
    const { restaurant, sessionUser } = req
    const { name, address } = req.body

    if(sessionUser.role === "admin") {
        await restaurant.update({ 
            name,
            address
        });
    }else{
        return next(new AppError('Only admin can update', 400));
    }

    res.status(201).json({
        status: "sucess",
        restaurant
    })
})

const disableRestaurant = catchAsync( async( req, res, next ) => {
    const { restaurant, sessionUser } = req

    if(sessionUser.role === "admin") {
        await restaurant.update({ status: "deleted" });
    }else{
        return next(new AppError("Only admin can delete", 400));
    }

    res.status(201).json({
        status: "sucess",
        restaurant
    })
})

const reviewRestaurant = catchAsync(async( req, res, next ) => {
    const { sessionUser, restaurant} = req
    const { comment, rating } = req.body

    const newReview = await Reviews.create({
        userId: sessionUser.id,
        comment,
        restaurantId: restaurant.id,
        rating
    })

    res.status(201).json({
        status: "sucess",
        newReview
    })
}) 

const updateReview = catchAsync(async( req, res, next ) => {
    const { review, sessionUser } = req
    const { comment, rating } = req.body

    if(sessionUser.id === review.userId){
        await review.update({ 
            comment,
            rating 
        });
    }else{
        return next(new AppError("You´re not the review creator", 400));
    }

    res.status(201).json({
        status: "sucess",
        review
    })
})

const deleteReview = catchAsync(async( req, res, next ) => {
    const { review, sessionUser } = req;

    if(sessionUser.id === review.userId) {
        await review.update({ status: "deleted" });
    }else{
        return next(new AppError('Only review creator can delete it', 400));
    }

    res.status(201).json({
        status: "sucess",
        review
    });
})

module.exports = { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, disableRestaurant, reviewRestaurant, updateReview, deleteReview }

