const path = require('path')
const User = require(path.join(__dirname, '..', 'Models', 'User'))
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const MessageHandler = require(path.join(__dirname, '..', 'utils', 'responses', 'MessageHandler'))

const ACCESS_TOKEN_LIFE_TIME = '30m'
const REFRESH_TOKEN_LIFE_TIME = '7d'

// const ACCESS_TOKEN_LIFE_TIME = '1m'
// const REFRESH_TOKEN_LIFE_TIME = '7d'

exports.register = async (req, res) => {
    const messageHandler = new MessageHandler(res)
    try{
        let { firstName, lastName, email, password, role  } = req.body
        
        if(!firstName)
            return messageHandler.error('First name is required !', 400)

        if(!lastName)
            return messageHandler.error('Last name is required !', 400)

        if(!email){
            return messageHandler.error('Email is required !', 400)
        }
        const exists = await User.findByEmail(email)
        if(exists)
            return messageHandler.error('There is already an account with this email !', 409)//conflict
        

        if(!password)
            return messageHandler.error('Password is required !', 400)

        if(!role)
            role = 'user'

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            firstName,
            lastName, 
            email, 
            password : hashedPassword, 
            role
        })
        
        if(user)
            return messageHandler.success('Account created successfully !', 201)
        
        messageHandler.error('Something went wrong please try again later !')
    }catch(error){
        messageHandler.error(error.message)
    }
}

exports.login = async (req, res) => {
    const messageHandler = new MessageHandler(res)
    try{
        const { email, password } = req.body

        if(!email)
            return messageHandler.error('Email is required !', 400)

        if(!password)
            return messageHandler.error('Password is required !', 400)

        const checkIfUserExists = await User.findByEmail(email)
        
        if(!checkIfUserExists)
            return messageHandler.error('There is no account with this email !', 404)
        
        const passwordsMatch = await bcrypt.compare(password, checkIfUserExists.password)
        if(!passwordsMatch)
            return messageHandler.error('You have provided a wrong password !', 401)

        //now auth is done successfully and need to create the tokens
        const TOKEN_PAYLOAD = { userId: checkIfUserExists._id, role: checkIfUserExists.role }
        const accessToken = jwt.sign(TOKEN_PAYLOAD, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE_TIME })
        const refreshToken = jwt.sign(TOKEN_PAYLOAD, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE_TIME })
        
        //update refresh token to user collection
        checkIfUserExists.refreshToken = refreshToken
        const saveRefreshToken = await checkIfUserExists.save()

        if(!saveRefreshToken)
            return  messageHandler.error('Something went wrong please try again later !')

        res.cookie('jwt', accessToken, {
            httpOnly: true, 
            sameSite: 'None',
            secure: true
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, 
            sameSite: 'None',
            secure: true
        })

        messageHandler.success('Login successful !')
    }catch(error){
        messageHandler.error(error.message)
    }
}

exports.refresh = async (req, res) => {
    const messageHandler = new MessageHandler(res)
    try{
        // return messageHandler.success('here')
        const refreshToken = req.cookies.refreshToken

        if(!refreshToken)
            return messageHandler.error('Unauthorized: RefreshToken missing !', 401)

        const findUser = await User.findByRefreshToken(refreshToken)

        if(!findUser)
            return messageHandler.error('Unauthorized: RefreshToken missing !', 401)

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if(err) 
                return messageHandler.error('RefreshToken isn\'t valid !', 403)
            
            const accessToken = jwt.sign(
                { userId: findUser._id, role: findUser.role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: ACCESS_TOKEN_LIFE_TIME }
            )

            res.cookie('jwt', accessToken, {
                httpOnly: true, 
                sameSite: 'None',
                secure: true//it should be true in https
            })

            messageHandler.success('Token is refreshed successfully !')
        })
    }catch(error){
        messageHandler.error(error.message)
    }
}

exports.logout = async (req, res) => {
    const messageHandler = new MessageHandler(res)
    try{
        const id = req.userId //it comes from middleware
        const user = await User.findById(id)

        user.refreshToken = null
        await user.save()

        res.clearCookie('jwt')
        res.clearCookie('refreshToken')

        messageHandler.success('Logged out successfully !')
    }catch(error){
        messageHandler.error(error.message)
    }
}

exports.getUser = async (req, res) => {
    const messageHandler = new MessageHandler(res)
    try{
        const id = req.userId //it comes from middleware
        const user = await User.findById(id).select('-password')

        messageHandler.success(null, 200, user)
    }catch(error){
        messageHandler.error(error.message)
    }
}