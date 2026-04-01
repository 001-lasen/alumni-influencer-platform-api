const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Alumni Influencer Platform API',
            version: '1.0.0',
            description: 'REST API for the Eastminster Alumni Influencer Platform.',
            contact: {
                name: 'Eastminster Alumni Platform',
                email: 'w1952526@westminster.ac.uk'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT access token'
                },
                apiKeyAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'API_KEY',
                    description: 'Enter your API key'
                }
            }
        }
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
