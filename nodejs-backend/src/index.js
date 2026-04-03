const express = require('express');
const logger = require('./logger');     
const routes = require('./routes');
const app = express();
const port = process.env.PORT || 8000;

function startServer() {
    app.use(express.json());

    app.use('/api', routes);

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });
}

module.exports = startServer;