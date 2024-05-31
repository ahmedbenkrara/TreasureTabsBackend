const path = require('path')
const express = require('express')
const SocialMediaController = require(path.join(__dirname, '..', '..', 'Controllers', 'SocialMediaController'))

const verifyAuthMiddleware = require(path.join(__dirname, '..', '..', 'Middleware', 'verifyAuthMiddleware'))

const router = express.Router()

router.route('/')
.get(verifyAuthMiddleware(['user']), SocialMediaController.getAll)
.post(verifyAuthMiddleware(['user']), SocialMediaController.create)

router.route('/:id')
.put(verifyAuthMiddleware(['user']), SocialMediaController.update)
.delete(verifyAuthMiddleware(['user']), SocialMediaController.delete)

module.exports = router