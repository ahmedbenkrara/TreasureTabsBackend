const path = require('path')
const SocialMedia = require(path.join(__dirname, '..', 'Models', 'SocialMedia'))
const MessageHandler = require(path.join(__dirname, '..', 'utils', 'responses', 'MessageHandler'))

const FILES_LINK_PREFIX = "uploads/"

exports.getAll = async (req, res) => {
    const messageHandler = new MessageHandler(res)

    try{
        const userId = req.userId
        const socialMedia = await SocialMedia.find({ user: userId })
        messageHandler.success('', 200, socialMedia)
    }catch(error){
        messageHandler.error(error.message)
    }
}

exports.create = async (req, res) => {
    const messageHandler = new MessageHandler(res)
    
    try{
        const icon = req.file
        const name  = req.body.name
        const userId = req.userId //comes from middleware

        if(!icon)
            return messageHandler.error('Social Media icon is required !', 400)

        if(!name)
            return messageHandler.error('Social Media name is required !', 400)

        const socialMedia = await SocialMedia.create({
            icon: FILES_LINK_PREFIX + icon.filename,
            name: name,
            user: userId
        })

        messageHandler.success('Social Media created successfully !', 201, socialMedia)

    }catch(error){
        messageHandler.error(error.message)
    }
}

exports.update = async (req, res) => {
    const messageHandler = new MessageHandler(res)

    try{
        const { id } = req.params
        const icon = req.file
        const { name } = req.body
        
        if(!name)
            return messageHandler.error('Social Media name is required !', 400)
        
        
        const socialMedia = await SocialMedia.findById(id)
        if(!socialMedia)
            return messageHandler.error('Social Media not found', 404)
        
        if(icon)
            socialMedia.icon = FILES_LINK_PREFIX + icon.filename

        socialMedia.name = name
        await socialMedia.save()

        messageHandler.success('Social Media updated successfully !')
    }catch(error){
        messageHandler.error(error.message)
    }
}

exports.delete = async (req, res) => {
    const messageHandler = new MessageHandler(res)

    try{
        const { id } = req.params

        const result = await SocialMedia.findByIdAndDelete(id)
        if(!result)
            return messageHandler.error('Social Media not found !', 404)

        messageHandler.success('Social Media deleted successfully', 204)
    }catch(error){
        messageHandler.error(error.message)
    }
}