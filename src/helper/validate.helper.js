const { body, query, param } = require('express-validator');

const loginValidator = () => [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 4 }).trim(),
];

const createAccountValidator = () => [
    body('name').isString().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 4 }).trim(),
];

const readAccountValidator = () => [
    query('userId').isUUID()
];

const updateAccountValidator = () => [
    body('name').isString().notEmpty()
];


const createPostValidator = () => [
    body('title').isString().notEmpty(),
    body('content').optional().isString()
];

const readAllPostsValidator = () => [
    query('searchString').optional().isString(),
    query('skip').optional().isNumeric(),
    query('take').optional().isNumeric(),
    query('orderBy').optional().isString().custom((value) => {
        if (value !== 'asc' && value !== 'desc') {
            throw new Error('orderBy must be "asc" or "desc"');
        }
        return true;
    }),
];

const readPostValidator = () => [
    param('id').isUUID(),
];

const updatePostViewCountValidator = () => [
    body('id').isUUID(),
];

const updatePostStatusValidator = () => [
    body('id').isUUID(),
    body('published').isBoolean(),
];

const deletePostValidator = () => [
    body('id').isUUID(),
];

module.exports = {
    loginValidator, createAccountValidator, readAccountValidator, updateAccountValidator, createPostValidator, readAllPostsValidator, readPostValidator, updatePostViewCountValidator, updatePostStatusValidator, deletePostValidator
}