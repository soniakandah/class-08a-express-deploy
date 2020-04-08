const timestamp = (req, res, next) => {
    // save new Date();
    // so that it can be used in logger
    req.time = new Date();
    next();
};

module.exports = timestamp;
