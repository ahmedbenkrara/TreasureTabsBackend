const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect('mongodb://localhost/treasuretabs')
        console.log('Connected to database ...')
    }catch(err){
        console.log(err.message)
    }
}

export default connectDB