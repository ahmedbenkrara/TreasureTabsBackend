const path = require('path')
const express = require('express')
const AuthController = require(path.join(__dirname, '..', '..', 'Controllers', 'AuthController'))

const verifyAuthMiddleware = require(path.join(__dirname, '..', '..', 'Middleware', 'verifyAuthMiddleware'))

const router = express.Router()

router.route('/register').post(AuthController.register)
router.route('/login').post(AuthController.login)
router.route('/refreshToken').post(AuthController.refresh)
router.route('/logout').post(verifyAuthMiddleware(['user']), AuthController.logout)//add middleware
router.route('/user').get(verifyAuthMiddleware(['user']), AuthController.getUser)//add middleware

module.exports = router