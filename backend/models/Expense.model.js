const mongoose = require('mongoose')
const categoriesJSON = require('../assets/categories.json')

const ExpenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: categoriesJSON,
        default: 'Others'
    }
})
ExpenseSchema.set('validateBeforeSave', true)

const Expense = mongoose.model('Expense', ExpenseSchema)
module.exports = {
    ExpenseSchema,
    Expense
}