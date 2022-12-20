const { default: mongoose } = require("mongoose")
const Schema = mongoose.Schema;

const accountSchema = new Schema ({

    balance: Number,
    portfolioId: { type: Schema.Types.ObjectId, ref: 'Portfolio' },
    
})

const Account = mongoose.model('Account', accountSchema)

module.export = Account