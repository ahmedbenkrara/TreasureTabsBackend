const path = require('path')
const express = require('express')
const CategoryController = require(path.join(__dirname, '..', '..', 'Controllers', 'CategoryController'))

const verifyAuthMiddleware = require(path.join(__dirname, '..', '..', 'Middleware', 'verifyAuthMiddleware'))

const router = express.Router()

router.route('/')
.get(verifyAuthMiddleware(['user']), CategoryController.getAll)
.post(verifyAuthMiddleware(['user']), CategoryController.create)

router.route('/:id')
.put(verifyAuthMiddleware(['user']), CategoryController.update)
.delete(verifyAuthMiddleware(['user']), CategoryController.delete)

module.exports = router