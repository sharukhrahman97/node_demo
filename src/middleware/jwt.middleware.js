require('dotenv').config();
const jwt = require("jsonwebtoken");
const { status } = require('../util/strings.util');
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
    const accessToken = req.header("CL-X-TOKEN");
    const refreshToken = req.cookies["CL-X-REFRESH"];
    if (accessToken && refreshToken) {
        try {
            const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
            req.body.userId = decodedToken.sub;
            next();
        } catch (accessTokenError) {
            try {
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
                const newAccessToken = refreshAccessToken(decodedRefreshToken);
                req.body.userId = decodedRefreshToken.sub;
                res.setHeader('CL-X-TOKEN', newAccessToken);
                res.cookie('CL-X-REFRESH', refreshToken, { httpOnly: true, secure: true });
                next();
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
