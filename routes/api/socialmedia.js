const path = require('path')
const express = require('express')
const SocialMediaController = require(path.join(__dirname, '..', '..', 'Controllers', 'SocialMediaController'))

const verifyAuthMiddleware = require(path.join(__dirname, '..', '..', 'Middleware', 'verifyAuthMiddleware'))
const uploadMiddleware = require(path.join(__dirname, '..', '..', 'Middleware', 'uploadMiddleware'))

const router = express.Router()

router.route('/')
.get(verifyAuthMiddleware(['user']), SocialMediaController.getAll)
.post(verifyAuthMiddleware(['user']), uploadMiddleware.uploadSingle, SocialMediaController.create)

router.route('/:id')
.put(verifyAuthMiddleware(['user']), uploadMiddleware.uploadSingle, SocialMediaController.update)
.delete(verifyAuthMiddleware(['user']), SocialMediaController.delete)

module.exports = router