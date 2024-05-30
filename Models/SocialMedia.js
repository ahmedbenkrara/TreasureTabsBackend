const mongoose = require('mongoose')

const SocialMediaSchema = new mongoose.Schema({
    icon: {
        type: String,
        trim: true
    },
    name: {
        type: String, 
        required: true, 
        lowercase: true,
        trim: true,
        minlength: 2
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('SocialMedia', SocialMediaSchema)