const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/api');
require('./startup/database')();
require('./startup/routes')(app);

const port = process.env.NODEPORT || 7345;

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        winston.info(`App listening on por ${port}`);
    });
}

module.exports = app;
