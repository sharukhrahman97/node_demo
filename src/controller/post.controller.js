const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createPost = async (req, res) => { }
const readAllPosts = async (req, res) => { }
const readAllDrafts = async (req, res) => { }
const readPost = async (req, res) => { }
const updatePostViewCount = async (req, res) => { }
const updatePostStatus = async (req, res) => { }
const deletePost = async (req, res) => { }
const deleteAllPost = async (req, res) => { }

module.exports = {
    createPost,
    readAllPosts,
    readAllDrafts,
    readPost,
    updatePostViewCount,
    updatePostStatus,
    deletePost,
    deleteAllPost
}