const { Unauthorized } = require('http-errors')
const { Account } = require('./models/Account.model')

async function loadPlugins(fastify) {
    fastify.register(require('@fastify/cors'), {
        origin: process.env.ALLOWED_ORIGINS.split(' '),
        exposedHeaders: ['X-Ratelimit-Reset', 'Retry-After']
    })
    fastify.register(require('@fastify/formbody'))

    fastify.register(require('@fastify/jwt'), {
        secret: process.env.JWT_SECRET_KEY
    })
    fastify.addHook('preHandler', (req, reply, next) => {
        req.jwt = fastify.jwt
        next()
    })
    fastify.decorate('authenticate', async (req, reply) => {
        const token = req.cookies['Token']
        if (!token) {
            return reply.send(Unauthorized('You still haven\'t login yet.'))
        }
        
        const decoded = req.jwt.decode(token)
        if (!(await Account.exists({ email: decoded.email }))) {
            return reply.send(Unauthorized('Token is not valid.'))
        }
    })
    fastify.register(require('@fastify/cookie'), {
        secret: process.env.JWT_COOKIE_KEY,
        hook: 'preValidation'
    })

    await fastify.register(require('@fastify/rate-limit'), {
        max: Number(process.env.ALLOWED_REQUEST_PER_MINUTE),
        timeWindow: 60 * 1000,
        hook: 'preHandler',
        keyGenerator: (req) => req.cookies['Token']
    })
    fastify.register(require('@fastify/compress'))
}

module.exports = {
    loadPlugins
}