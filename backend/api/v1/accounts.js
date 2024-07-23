const utils = require('../../utils')
const { Conflict, InternalServerError, Unauthorized } = require('http-errors')
const crypto = require('crypto')
const { Account } = require('../../models/Account.model')

module.exports = function (fastify, opts, done) {
    fastify.post('/signup', async (req, reply) => {
        try {
            const hmac = crypto.createHmac('sha256', req.body.password)
            req.body.password = hmac.digest('hex')

            const account = new Account(req.body)
            if (await Account.exists({ email: req.body.email })) {
                return Conflict('Account\'s email already exists')
            }
            
            const savedAccount = await account.save()
            if (!savedAccount) {
                return InternalServerError('Failed to save the account')
            }

            const token = utils.generateJwtToken(fastify, savedAccount)
            reply.setCookie('Token', token, {
                path: '/',
                httpOnly: true,
                secure: !utils.isDevMode(),
                maxAge: (60 * 60 * 24 * 7) // 1 week
            })

            return reply.code(201).send({
                id: savedAccount._id,
                name: savedAccount.username,
                token: token
            })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.post('/signin', async (req, reply) => {
        try {
            if (!(req.body.email || req.body.password)) {
                throw Unauthorized('Input is invalid')
            }

            const hmac = crypto.createHmac('sha256', req.body.password)
            req.body.password = hmac.digest('hex')

            const foundAccount = await Account.findOne({ email: req.body.email })
            if (!foundAccount) {
                throw Unauthorized('Account not found')
            }

            const isPasswordValid = crypto.timingSafeEqual(
                Buffer.from(req.body.password),
                Buffer.from(foundAccount.password)
            )
            if (!isPasswordValid) {
                throw Unauthorized('Username or password is invalid')
            }

            const token = utils.generateJwtToken(fastify, foundAccount)
            reply.setCookie('Token', token, {
                path: '/',
                httpOnly: true,
                secure: !utils.isDevMode(),
                maxAge: (60 * 60 * 24 * 7) // 1 week
            })

            return reply.code(201).send({
                id: foundAccount._id,
                name: foundAccount.username,
                token: token
            })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.post('/signout', async (req, reply) => {
        try {
            reply.clearCookie('Token')
            return reply.code(204).send()
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    done()
}