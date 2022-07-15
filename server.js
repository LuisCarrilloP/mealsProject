const { app } = require("./app")

//Models
const { Restaurants } = require("./models/restaurants.model")
const { Meals } = require("./models/meals.model")
const { Orders } = require("./models/orders.model")
const { Reviews } = require("./models/reviews.model")
const { Users } = require("./models/users.model")
 
//Utils
const { db } = require("./utils/database.util")

//Authenticate db
db.authenticate()
    .then(console.log("Db authenticated"))
    .catch(err => console.log(err))

//Relations
    //1 Restaurants <----> M Reviews
    Restaurants.hasMany(Reviews, { foreignKey: "restaurantId"})
    Reviews.belongsTo(Restaurants)

    //1 Restaurants <----> M Meals
    Restaurants.hasMany(Meals, { foreignKey: "restaurantId"})
    Meals.belongsTo(Restaurants)

    //1 Meals <---> 1 Orders
    Meals.hasOne(Orders, { foreignKey: "mealId" })
    Orders.belongsTo(Meals)

    //1 User <---> M Reviews 
    Users.hasMany(Reviews, { foreignKey: "userId" })
    Reviews.belongsTo(Users)

    //1 User <---> M Orders
    Users.hasMany(Orders, { foreignKey: "userId"})
    Orders.belongsTo(Users)

//Sync db
db.sync()
    .then(console.log("Db synced"))
    .catch(err => console.log(err))

app.listen(4400, () => {
    console.log("Server running succesfully");
})