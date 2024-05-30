const mongoose = require('mongoose')

const bookmarkSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        lowercase: true,
        minlength: 3,
        trim: true
    },
    description: {
        type: String,
        minlength: 3,
        trim: true
    },
    tags: [String],
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    socialmedia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SocialMedia',
        required: true
    }
})

module.exports = mongoose.model('BookMark', bookmarkSchema)