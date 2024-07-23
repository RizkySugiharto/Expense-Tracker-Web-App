const mongoose = require('mongoose')
const { ExpenseSchema } = require('./Expense.model')

const AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    expenses: {
        type: [ExpenseSchema],
        default: []
    }
})
AccountSchema.set('validateBeforeSave', true)

const Account = mongoose.model('Account', AccountSchema)
module.exports = {
    AccountSchema,
    Account
}