const { default: mongoose } = require("mongoose")
const Schema = mongoose.Schema;

const portfolioSchema = new Schema ({

    owner: {type: Schema.Types.ObjectId, ref: "User"},
    name: String,
    balance: {
        type: Number,
        default: 1000000
    },
    holdings: [{ type: Schema.Types.ObjectId, ref: 'Stock'}]

})

const Portfolio = mongoose.model('Portfolio', portfolioSchema)

module.exports = Portfolio