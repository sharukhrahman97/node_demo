require('dotenv').config();
const jwt = require("jsonwebtoken");
const { status } = require('../util/status.util');
const { responseHelper } = require('../helper/response.helper');
const crypto = require('crypto');

const generateUniqueToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

const createTokens = (userId) => {
    const accessToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
        algorithm: "HS256",
        jwtid: generateUniqueToken()
    });
    const refreshToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.REFRESH_TIMEOUT,
        algorithm: "HS256",
        jwtid: generateUniqueToken()
    });
    return { accessToken, refreshToken };
};

const verifyTokens = (req, res, next) => {
    if (process.env.MODE === 1) return next()
    const accessToken = req.header("CL-X-TOKEN");
    const refreshToken = req.header("CL-X-REFRESH");
    if (accessToken && refreshToken) {
        try {
            const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
            req.body.userId = decodedToken.sub;
            return next();
        } catch (accessTokenError) {
            try {
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
                const newAccessToken = refreshAccessToken(decodedRefreshToken);
                req.body.userId = decodedRefreshToken.sub;
                res.cookie('CL-X-TOKEN', newAccessToken, { httpOnly: true, secure: true });
                res.cookie('CL-X-REFRESH', refreshToken, { httpOnly: true, secure: true });
                return next();
            } catch (refreshTokenError) {
                return res.status(status.refreshError.code).json(responseHelper(status.refreshError, "Invalid tokens"));
            }
        }
    } else {
        return res.status(status.authError.code).json(responseHelper(status.authError, "Tokens are missing"));
    }
};

const refreshAccessToken = (decodedToken) => {
    const accessToken = jwt.sign({ sub: decodedToken.sub }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
        algorithm: "HS256",
        jwtid: generateUniqueToken()
    });
    return accessToken;
};

module.exports = { createTokens, verifyTokens, refreshAccessToken };
