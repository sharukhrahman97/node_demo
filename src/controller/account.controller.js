const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createAccount = async (req, res) => { }
const readAccount = async (req, res) => { }
const readAllAccounts = async (req, res) => { }
const updateAccount = async (req, res) => { }
const deleteAccount = async (req, res) => { }

module.exports = {
    createAccount,
    readAccount,
    readAllAccounts,
    updateAccount,
    deleteAccount
}