const mongoose = require('mongoose')

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
        enum: ['Groceries', 'Leisure', 'Electronics', 'Utilities', 'Clothing', 'Health', 'Others'],
        default: 'Others'
    }
})
ExpenseSchema.set('validateBeforeSave', true)

const Expense = mongoose.model('Expense', ExpenseSchema)
module.exports = {
    ExpenseSchema,
    Expense
}