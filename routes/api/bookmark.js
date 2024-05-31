const path = require('path')
const express = require('express')
const BookMarkController = require(path.join(__dirname, '..', '..', 'Controllers', 'BookMarkController'))

const verifyAuthMiddleware = require(path.join(__dirname, '..', '..', 'Middleware', 'verifyAuthMiddleware'))

const router = express.Router()

router.route('/category/:category/socialmedia/:socialmedia')
.get(verifyAuthMiddleware(['user']), BookMarkController.getAllByCategoryAndSocialMedia)

router.route('/')
.post(verifyAuthMiddleware(['user']), BookMarkController.create)

router.route('/:id')
.put(verifyAuthMiddleware(['user']), BookMarkController.update)
.delete(verifyAuthMiddleware(['user']), BookMarkController.delete)

module.exports = router