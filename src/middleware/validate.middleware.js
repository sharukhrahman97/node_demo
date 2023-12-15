const { validationResult } = require('express-validator');
const { status } = require('../util/status.util')
const { responseHelper } = require('../helper/response.helper');

// Validate function to handle the validation result
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(status.validationError.code).json(responseHelper(status.validationError, errors.array()));
};

module.exports = {
    validate,
};