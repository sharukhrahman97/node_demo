const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { status } = require('../util/status.util')
const { responseHelper } = require('../helper/response.helper')

const createPost = async (req, res) => {
    try {
        const { title, content, userId } = req.body
        const result = await prisma.post.create({
            data: {
                title,
                content,
                author: { connect: { id: userId } },
            },
        })
        return res.status(status.insertDoc.code).json(responseHelper(status.insertDoc, result));
    } catch (error) {
        return res.status(status.insertErrorDoc.code).json(responseHelper(status.insertErrorDoc, error));
    }
}

const readAllPosts = async (req, res) => {
    try {
        const { searchString, skip, take, orderBy } = req.query
        const or = searchString
            ? {
                OR: [
                    { title: { contains: searchString } },
                    { content: { contains: searchString } },
                ],
            }
            : {}

        const result = await prisma.post.findMany({
            where: {
                published: true,
                ...or,
            },
            take: take || undefined,
            skip: skip || undefined,
            orderBy: {
                updatedAt: orderBy || undefined,
            },
            select: { id: true, createdAt: true, updatedAt: true, title: true, content: true, published: true, viewCount: true, authorId: true, author: { select: { id: true, name: true, email: true } } }
        })
        return res.status(status.readDoc.code).json(responseHelper(status.readDoc, result));
    } catch (error) {
        return res.status(status.readErrorDoc.code).json(responseHelper(status.readErrorDoc, error));
    }
}

const readAllDrafts = async (req, res) => {
    try {
        const { userId } = req.body
        const result = await prisma.user
            .findUnique({
                where: {
                    id: userId,
                },
            })
            .posts({
                where: { published: false },
            })
        return res.status(status.readDoc.code).json(responseHelper(status.readDoc, result));
    } catch (error) {
        return res.status(status.readErrorDoc.code).json(responseHelper(status.readErrorDoc, error));
    }
}

const readPost = async (req, res) => {
    try {
        const { id } = req.params
        const result = await prisma.post.findUnique({
            where: { id: id, published: true },
            select: { id: true, createdAt: true, updatedAt: true, title: true, content: true, published: true, viewCount: true, authorId: true, author: { select: { id: true, name: true, email: true } } }
        })
        return res.status(status.readDoc.code).json(responseHelper(status.readDoc, result));
    } catch (error) {
        return res.status(status.readErrorDoc.code).json(responseHelper(status.readErrorDoc, error));
    }
}

const updatePostViewCount = async (req, res) => {
    try {
        const { id } = req.body
        const result = await prisma.post.update({
            where: { id: id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        })
        return res.status(status.updateDoc.code).json(responseHelper(status.updateDoc, result));
    } catch (error) {
        return res.status(status.updateErrorDoc.code).json(responseHelper(status.updateErrorDoc, error));
    }
}

const updatePostStatus = async (req, res) => {
    try {
        const { id, published } = req.body
        const result = await prisma.post.update({
            where: { id: id },
            data: { published: published },
        })
        return res.status(status.updateDoc.code).json(responseHelper(status.updateDoc, result));
    } catch (error) {
        return res.status(status.updateErrorDoc.code).json(responseHelper(status.updateErrorDoc, error));
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.body
        const result = await prisma.post.delete({
            where: {
                id: id,
            },
        })
        return res.status(status.deleteDoc.code).json(responseHelper(status.deleteDoc, result));
    } catch (error) {
        return res.status(status.deleteErrorDoc.code).json(responseHelper(status.deleteErrorDoc, error));
    }
}

module.exports = {
    createPost,
    readAllPosts,
    readAllDrafts,
    readPost,
    updatePostViewCount,
    updatePostStatus,
    deletePost,
}