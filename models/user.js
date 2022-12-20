const { Schema, model } = require("mongoose")



const userSchema = new Schema ({
    email: {
        type: String,
        unique: true,
        required: true 
    },
    password: {
        type: String,
        required: true
    },
    username: String,
    portfolio: {type: Schema.Types.ObjectId, ref: 'Portfolio'}
})

const User = model('User', userSchema)

module.exports = User;
