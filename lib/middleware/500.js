const serverError = (err, req, res, next) => {
    res.status(500);
    res.end();
};

module.exports = serverError;
