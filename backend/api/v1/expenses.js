const utils = require('../../utils')
const { BadRequest } = require('http-errors')
const { Expense } = require('../../models/Expense.model')
const { Account } = require('../../models/Account.model')
const categoriesJSON = require('../../assets/categories.json')

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

    fastify.get('/:accountId', {
        preHandler: [fastify.authenticate]
    }, async (req, reply) => {
        try {
            const account = await Account.findById(req.params.accountId)
            if (!account) {
                throw BadRequest('Account not found')
            }

            return reply.code(200).send(account.expenses.map(expense => ({
                id: expense._id,
                amount: expense.amount,
                description: expense.description,
                category: expense.category
            })))
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.post('/:accountId', {
        preHandler: [fastify.authenticate]
    }, async (req, reply) => {
        try {
            const account = await Account.findById(req.params.accountId)
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
                category: expense.category
            })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.put('/:accountId/:expenseId', {
        preHandler: [fastify.authenticate]
    }, async (req, reply) => {
        try {
            const account = await Account.findById(req.params.accountId)
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
                category: expense.category
            })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.delete('/:accountId/:expenseId', {
        preHandler: [fastify.authenticate]
    }, async (req, reply) => {
        try {
            const account = await Account.findById(req.params.accountId)
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