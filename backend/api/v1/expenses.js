const utils = require('../../utils')
const { BadRequest } = require('http-errors')
const { Expense } = require('../../models/Expense.model')
const { Account } = require('../../models/Account.model')
const dateAndTime = require('date-and-time')
const categoriesJSON = require('../../assets/categories.json')

function filterByDate(expenses, dateString) {
    const dateStringLower = dateString.toLowerCase()
    const currentDate = new Date()

    if (dateStringLower === 'past week') {
        const first = currentDate.getDate() - currentDate.getDay() - 7
        const last = first + 6 // 1 + (Sunday) + 6 = 7 (Saturday)
        const firstDate = new Date(currentDate.setDate(first))
        const lastDate = new Date(currentDate.setDate(last))
        
        return expenses.filter(expense => expense.date >= firstDate && expense.date <= lastDate)
    } else if (dateStringLower === 'last month') {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() - 1
        const firstDate = new Date(year, month, 1)
        const lastDate = new Date(year, month + 1, 0)
        
        return expenses.filter(expense => expense.date >= firstDate && expense.date <= lastDate)
    } else if (dateStringLower === 'last 3 months') {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() - 3
        const firstDate = new Date(year, month, 1)
        const lastDate = new Date(year, month + 3, 0)

        return expenses.filter(expense => expense.date >= firstDate && expense.date <= lastDate)
    } else {
        const parsePattern = 'DD/MM/YYYY'
        const dates = dateString.split('-')
        const dateFrom = dateAndTime.parse(dates[0], parsePattern)
        const dateTo = dateAndTime.parse(dates[1], parsePattern)
    
        return expenses.filter(expense => expense.date >= dateFrom && expense.date <= dateTo)
    }
}

module.exports = function (fastify, opts, done) {
    fastify.get('/categories', {
        preHandler: [fastify.authenticate]
    }, async (req, reply) => {
        try {
            return reply.code(200).send(categoriesJSON)
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.get('/', {
        preHandler: [fastify.authenticate]
    }, async (req, reply) => {
        try {
            const payload = req.jwt.decode(req.cookies['Token'])
            const account = await Account.findById(payload.id)
            if (!account) {
                throw BadRequest('Account not found')
            }

            let expenses = account.expenses
            if (req.query.date) {
                expenses = filterByDate(expenses, req.query.date)
            }
            if (req.query.categories) {
                const categories = req.query.categories.split(',')
                expenses = expenses.filter(expense => categories.includes(expense.category))
            }

            return reply.code(200).send(expenses.map(expense => ({
                id: expense._id,
                amount: expense.amount,
                description: expense.description,
                date: expense.date,
                category: expense.category
            })))
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.post('/', {
        preHandler: [fastify.authenticate]
    }, async (req, reply) => {
        try {
            const payload = req.jwt.decode(req.cookies['Token'])
            const account = await Account.findById(payload.id)
            if (!account) {
                throw BadRequest('Account not found')
            }
            
            const expense = new Expense(req.body)
            account.expenses.push(expense)
            const savedAccount = await account.save()
            if (!savedAccount) {
                throw BadRequest('Could not save the data')
            }
            
            return reply.code(201).send({
                id: expense._id,
                amount: expense.amount,
                description: expense.description,
                date: expense.date,
                category: expense.category
            })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.put('/:expenseId', {
        preHandler: [fastify.authenticate]
    }, async (req, reply) => {
        try {
            const payload = req.jwt.decode(req.cookies['Token'])
            const account = await Account.findById(payload.id)
            if (!account) {
                throw BadRequest('Account not found')
            }
            
            const expense = account.expenses.id(req.params.expenseId)
            if (!expense) {
                throw BadRequest('Expense not found')
            }

            expense.set('amount', req.body.amount ? req.body.amount : expense.amount)
            expense.set('description', req.body.description ? req.body.description : expense.description)
            expense.set('category', req.body.category ? req.body.category : expense.category)
            const savedAccount = await account.save()
            if (!savedAccount) {
                throw BadRequest('Could not save the data')
            }
            
            return reply.code(200).send({
                id: expense._id,
                amount: expense.amount,
                description: expense.description,
                date: expense.date,
                category: expense.category
            })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.delete('/:expenseId', {
        preHandler: [fastify.authenticate]
    }, async (req, reply) => {
        try {
            const payload = req.jwt.decode(req.cookies['Token'])
            const account = await Account.findById(payload.id)
            if (!account) {
                throw BadRequest('Account not found')
            }
            
            account.expenses.id(req.params.expenseId).deleteOne()
            const savedAccount = await account.save()
            if (!savedAccount) {
                throw BadRequest('Could not save the data')
            }

            return reply.code(204).send()
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })
    
    done()
}