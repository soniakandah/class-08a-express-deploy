'use strict';

const logger = (req, res, next) => {
    console.log('request made to', req.method, req.url, 'at', req.time);
    next();
};

module.exports = logger;
