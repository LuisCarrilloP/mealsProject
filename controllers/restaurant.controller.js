//Models
const res = require("express/lib/response")
const { Restaurants } = require("../models/restaurants.model")
const { Reviews } = require("../models/reviews.model")

//Utils
const { catchAsync } = require("../utils/catchAsync.util")

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
    const restaurants = await Restaurants.findAll({ where: { status: "active" } })

    res.status(200).json({
        status: "sucess",
        restaurants
    })
})

const getRestaurantById = catchAsync( async( req, res, next ) => {
    const { restaurant } = req

    const restaurantId = await Restaurants.findOne({ where: { id: restaurant.id } })
    
    res.status(200).json({
        status: "sucess",
        restaurantId
    })
})

const updateRestaurant = catchAsync( async( req, res, next ) => {
    const { name, address } = req.body
    const { restaurant } = req

    const restaurantU = await restaurant.update({
        name,
        address
    })

    res.status(204).json({
        status: "sucess",
        restaurantU
    })
})

const disableRestaurant = catchAsync( async( req, res, next ) => {
    const { restaurant } = req

    const restaurantD = await restaurant.update({ status: "delete" })

    res.status(204).json({
        status: "sucess",
        restaurantD
    })
})

const reviewRestaurant = catchAsync(async( req, res, next ) => {
    const { sessionUser } = req
    const { comment, rating } = req.body
    const { restaurantId } = req.params

    const newReview = await Reviews.create({
        userId: sessionUser.id,
        restaurantId,
        comment,
        rating
    })

    res.status(201).json({
        status: "sucess",
        newReview
    })
}) 

const updateReview = catchAsync(async( req, res, next ) => {
    const { comment, rating } = req.body
    const { review } = req

    const reviewU = await review.update({
        comment,
        rating
    })

    res.status(204).json({
        status: "sucess",
        reviewU
    })
})

const deleteReview = catchAsync(async( req, res, next ) => {
    const { review } = req;

    const reviewD = await review.update({
        status: 'deleted',
    });

    res.status(204).json({
        status: "sucess",
        reviewD
    });
})

module.exports = { createRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, disableRestaurant, reviewRestaurant, updateReview, deleteReview }

