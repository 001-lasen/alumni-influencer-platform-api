#!/usr/bin/env node
require('dotenv').config({
    path: require('path').resolve(__dirname, 'env/.env.' + (process.env.NODE_ENV || 'local')),
});

const http = require('http');
const app = require('./app');
const db = require('./src/models');

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

(async () => {
    try {
        await db.sequelize.authenticate();
        console.log('Database connected');

        await db.sequelize.sync({ alter: true });
        console.log('Models synced');

        server.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})();

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});

process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await db.sequelize.close();
    server.close(() => {
        console.log('Server closed cleanly');
        process.exit(0);
    });
});
