const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { status } = require('../util/status.util')
const { responseHelper } = require('../helper/response.helper')
const { createTokens } = require('../middleware/jwt.middleware')
const { generateSalt, hashPassword, verifyPassword } = require("../util/password.util")

const loginAccount = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({
            where: { email: email },
        })
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const verify = verifyPassword(password, user.salt, user.hashedPassword)
        if (!verify) {
            throw new Error("Invalid email or password");
        }
        const { accessToken, refreshToken } = createTokens(user.id)
        res.cookie('CL-X-TOKEN', accessToken, { httpOnly: true, secure: true });
        res.cookie('CL-X-REFRESH', refreshToken, { httpOnly: true, secure: true });
        return res.status(status.readDoc.code).json(responseHelper(status.readDoc, { name: user.name, email: user.email }));
    } catch (error) {
        return res.status(status.readErrorDoc.code).json(responseHelper(status.readErrorDoc, error));
    }
}

const createAccount = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const { salt, hashedPassword } = hashPassword(password, generateSalt())
        const result = await prisma.user.create({
            data: {
                name,
                email,
                salt,
                hashedPassword,
                posts: {
                    create: [],
                },
            },
        })
        const { accessToken, refreshToken } = createTokens(result.id)
        res.cookie('CL-X-TOKEN', accessToken, { httpOnly: true, secure: true });
        res.cookie('CL-X-REFRESH', refreshToken, { httpOnly: true, secure: true });
        return res.status(status.insertDoc.code).json(responseHelper(status.insertDoc, { name: result.name, email: result.email }));
    } catch (error) {
        return res.status(status.insertErrorDoc.code).json(responseHelper(status.insertErrorDoc, error));
    }
}

const readAccount = async (req, res) => {
    try {
        const { userId } = req.query
        const result = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, posts: { select: { id: true, createdAt: true, updatedAt: true, title: true, content: true, viewCount: true } } }
        })
        return res.status(status.readDoc.code).json(responseHelper(status.readDoc, result));
    } catch (error) {
        return res.status(status.readErrorDoc.code).json(responseHelper(status.readErrorDoc, error));
    }
}

const readAllAccounts = async (req, res) => {
    try {
        const result = await prisma.user.findMany({
            select: { id: true, name: true, email: true }
        })
        return res.status(status.readDoc.code).json(responseHelper(status.readDoc, result));
    } catch (error) {
        return res.status(status.readErrorDoc.code).json(responseHelper(status.readErrorDoc, error));
    }
}

const updateAccount = async (req, res) => {
    try {
        const { userId, name } = req.body
        try {
            const result = await prisma.user.update({
                where: { id: userId },
                data: { name: name },
            })
            return res.status(status.updateDoc.code).json(responseHelper(status.updateDoc, { name: result.name, email: result.email }));
        } catch (error) {
            res.json({ error: `Post with ID ${id} does not exist in the database` })
        }
    } catch (error) {
        return res.status(status.updateErrorDoc.code).json(responseHelper(status.updateErrorDoc, error));
    }
}
const deleteAccount = async (req, res) => {
    try {
        const { userId } = req.body
        const deleteUser = prisma.user.delete({ where: { id: userId } })
        const deleteAllPosts = prisma.post.deleteMany({ where: { authorId: userId } })
        const result = prisma.$transaction([deleteAllPosts, deleteUser])
        res.clearCookie('CL-X-TOKEN')
        res.clearCookie('CL-X-REFRESH')
        return res.status(status.deleteDoc.code).json(responseHelper(status.deleteDoc, result));
    } catch (error) {
        return res.status(status.deleteErrorDoc.code).json(responseHelper(status.deleteErrorDoc, error));
    }
}

module.exports = {
    loginAccount,
    createAccount,
    readAccount,
    readAllAccounts,
    updateAccount,
    deleteAccount
}