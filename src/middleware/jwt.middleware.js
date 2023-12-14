require('dotenv').config()
const jwt = require("jsonwebtoken");
const { status } = require('../util/strings.util')
const { responseHelper } = require('../helper/response.helper')

// creating jwt token
const createTokens = (userId) => {
    const accessToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
        algorithm: "HS256",
        jwtid: crypto.getRandomValues(new Uint8Array(1))
    });
    const refreshToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.REFRESH_TIMEOUT,
        algorithm: "HS256",
        jwtid: crypto.getRandomValues(new Uint8Array(1))
    });
    return { accessToken, refreshToken }
};

// verifying jwt token
const verifyTokens = (req, res, next) => {
    const accessToken = req.header("CL-X-TOKEN");
    const refreshToken = req.cookie("CL-X-REFRESH");
    if (accessToken && refreshToken) {
        try {
            const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET)
            req.body.userId = decodedToken.sub;
            next();
        } catch (error) {
            if (error === 'invalid token') {
                const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
                const accessToken = refreshAccessToken(refreshToken)
                req.body.userId = decodedToken.sub;
                req.header['CL-X-TOKEN'] = accessToken;
                req.cookie['CL-X-REFRESH'] = refreshToken;
                next();
            }
            return res.status(status.authError.code).json(responseHelper(status.authError, error));
        }
    } else {
        return res.status(status.authError.code).json(responseHelper(status.authError, error));
    }
};

// refresh access token
const refreshAccessToken = (decodedToken) => {
    const accessToken = jwt.sign({ sub: decodedToken.sub }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
        algorithm: "HS256",
        jwtid: crypto.getRandomValues(new Uint8Array(1))
    });
    return accessToken
}

module.exports = { createTokens, verifyTokens, refreshAccessToken };