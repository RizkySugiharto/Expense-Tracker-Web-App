async function main() {
    // Load environtment configuration
    const config = require('./config')
    config.loadConfig()
    
    // Initialize the app
    const logger = require('./logger')
    const fastify = require('fastify')({
        logger: logger
    })
    
    // Connet to MongoDB
    const mongoose = require('mongoose')
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => fastify.log.info('Mongoose: DB successfully connected'))
        .catch((err) => fastify.log.error(`Mongoose: ${err.message}`))
    
    // Register all plugins
    const plugins = require('./plugins')
    await plugins.loadPlugins(fastify)
    
    // Register all routes
    fastify.register(require(`./api/v${process.env.API_VERSION}/accounts`), 
        { prefix: `/v${process.env.API_VERSION}/accounts` }
    )
    fastify.register(require(`./api/v${process.env.API_VERSION}/expenses`),
        { prefix: `/v${process.env.API_VERSION}/expenses` }
    )
    fastify.get('/', async (req, reply) => {
        return "Hello, World"
    })
    
    // Start the app
    fastify.listen({ port: process.env.PORT, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }
        fastify.log.info(`App listening on: ${address}`)
    })
}

main()