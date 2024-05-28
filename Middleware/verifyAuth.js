const jwt = require('jsonwebtoken')

const MessageHandler = require(path.join(__dirname, '..', 'utils', 'responses', 'MessageHandler'))

const verifyAuth = (roles = []) => async (req, res, next) => {
    const token = req.cookie.jwt
    const messageHandler = new MessageHandler(res)

    if(!token) return messageHandler.error('Unauthorized : Access token not found !', 401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if(err) return messageHandler.error('Access token isn\'t valid !', 403)

        if(!roles.includes(decode.role))
            return messageHandler.error('Forbidden: You do not have permission to access this resource', 403)

        req.userEmail = decode.userEmail
        req.role = decode.role
        
        next()
    })
}

module.exports = verifyAuth