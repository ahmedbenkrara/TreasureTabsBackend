const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: true,
        lowercase: true,
        minlength: 3,
        trim: true
    },
    lastName: {
        type: String, 
        required: true,
        lowercase: true,
        minlength: 3,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    refreshToken: String, 
    role: {
        type: String,
        enum: ['user', 'admin'],
        lowercase: true,
        default: 'user'
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
    ],
    socialmedias: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SocialMedia'
        }
    ]
})

userSchema.statics.findByEmail = function(email){
    return this.findOne({ email: {$eq: email.toLowerCase()} })
}

userSchema.statics.findByRefreshToken = function(token){
    return this.findOne({ refreshToken: token })
}

module.exports = mongoose.model('User', userSchema)