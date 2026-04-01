#!/usr/bin/env node
if (process.env.NODE_ENV !== 'develop') {
    require('dotenv').config({
        path: require('path').resolve(__dirname, 'env/.env.' + (process.env.NODE_ENV || 'local')),
    });
}

const logger = require('./src/utils/logger');

if (!process.env.DB_HOST) {
    logger.warn('Missing DB_HOST env var. Check your env file.');
}

const http = require('http');
const app = require('./app');
const db = require('./src/models');
const startAllJobs = require('./src/jobs');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

(async () => {
    try {
        logger.info('Connecting to database...');
        await db.sequelize.authenticate();
        logger.info('Database connected');

        logger.info('Syncing models...');
        await db.sequelize.sync({ alter: true });
        logger.info('Models synced');

        server.listen(port, () => {
            logger.info(`Server running on port ${port}`);

            if (process.env.NODE_ENV !== 'develop') {
                startAllJobs();
            }
        });

    } catch (err) {
        logger.error('Failed to start server:', err);
        process.exit(1);
    }
})();

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${port} is already in use.`);
        process.exit(1);
    } else {
        logger.error('Server error:', err);
    }
});

process.on('SIGINT', async () => {
    logger.warn('Shutting down server...');
    await db.sequelize.close();
    server.close(() => {
        logger.warn('Server closed cleanly');
        process.exit(0);
    });
});

module.exports = app;
