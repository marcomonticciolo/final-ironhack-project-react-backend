const { default: mongoose } = require("mongoose")
const Schema = mongoose.Schema;

const stockSchema = new Schema ({

    symbol: String,
    price: Number,
    shares: Number,
    date: {
        type: Date,
        default: Date.now
    }
})

const Stock = mongoose.model('Stock', stockSchema)

module.exports = Stock