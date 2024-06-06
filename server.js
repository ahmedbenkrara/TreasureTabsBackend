const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require(path.join(__dirname, 'database', 'connect'))

//routers
const authRouter = require(path.join(__dirname, 'routes', 'api', 'auth'))
const categoryRouter = require(path.join(__dirname, 'routes', 'api', 'category'))
const socialmediaRouter = require(path.join(__dirname, 'routes', 'api', 'socialmedia'))
const bookmarkRouter = require(path.join(__dirname, 'routes', 'api', 'bookmark'))

//Sanitize
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')

const app = express()
dotenv.config()

//connect to database
connectDB()

app.use(express.json())


//get files endpoint
app.get('/uploads/*', (req, res) => {
    const filename = req.params[0];
    res.sendFile(path.join(__dirname, 'uploads', filename));
})

//middlewares
app.use(cookieParser())
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
console.log(process.env.COR_ORIGINS.split(','))
app.use(cors({
    origin: process.env.COR_ORIGINS.split(','),
    credentials: true,
    exposedHeaders: ['set-cookie']
}))

app.get('/', (req, res) => {
    res.json({
        message: 'done'
    })
})

app.use('/api/auth', authRouter)
app.use('/api/category', categoryRouter)
app.use('/api/socialmedia', socialmediaRouter)
app.use('/api/bookmark', bookmarkRouter)

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => console.log(`listenning on port ${PORT}`))