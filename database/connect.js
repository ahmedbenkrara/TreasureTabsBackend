const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const DB_URI = process.env.DATABASE_URI ?? 'mongodb://localhost/treasuretabs'
        await mongoose.connect(DB_URI)
        console.log('Connected to database ...')
    }catch(err){
        console.log(err.message)
    }
}

module.exports = connectDB