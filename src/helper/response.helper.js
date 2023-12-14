// RESPONSE HANDLED HERE
const responseHelper = (status, result) => {
    const response = {
        code: status.statusCode,
        message: status.statusMessage,
        result,
    };
    return response;
};

module.exports = { responseHelper }