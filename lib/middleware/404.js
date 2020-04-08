// 404 is an error when a client tries to request something
// that the server can't find

const notFound = (req, res, next) => {
    // we couldn't find it
    // so set status code to 404
    // maybe send an error message? maybe not

    res.status(404);
    res.end();
};

module.exports = notFound;
