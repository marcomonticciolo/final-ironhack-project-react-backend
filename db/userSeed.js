require("dotenv").config()
const mongoose = require ("mongoose")
const User = require ("../models/user")

mongoose.connect(process.env.MONGODB_URI)
.then(x => {
    console.log("CONNECTED TO ", x.connections[0].name)
    return User.create({
        email: 'marco@marco.com',
        password: 'marcoiscool',
        username: 'marco'
    })
})
.then(createdUser => {
    console.log("this is the new user", createdUser)
})
.catch(err => console.log(err))
