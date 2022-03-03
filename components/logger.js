const winston = require('winston');
const expressWinston = require('express-winston');


const logger = expressWinston.logger({
    transports: [
        new winston.transports.File({
            filename: 'sammelband.log',
            json: false
        })
    ],
    meta: true,
    expressFormat: true,
    requestWhitelist: [
        'body',
        'ip'
    ]
});

module.exports = logger;
