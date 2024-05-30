const path = require('path')
const BookMark = require(path.join(__dirname, '..', 'Models', 'BookMark'))
const SocialMedia = require(path.join(__dirname, '..', 'Models', 'SocialMedia'))
const Category = require(path.join(__dirname, '..', 'Models', 'Category'))
const MessageHandler = require(path.join(__dirname, '..', 'utils', 'responses', 'MessageHandler'))

exports.getAllByCategoryAndSocialMedia = async (req, res) => {
    const messageHandler = new MessageHandler(res)

    try{
        const { category, socialmedia } = req.params
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        let query = {}
        if(category.toLowerCase() == 'all'){
            query = { socialmedia : socialmedia }
        }
        else{
            query = { category: category, socialmedia : socialmedia }
        }

        const bookMarks = await BookMark.find(query).skip((page - 1) * limit).limit(limit)

        const totalCount = await BookMark.countDocuments(query)
        const totalPages = Math.ceil(totalCount / limit)

        const response = {
            bookmarks: bookMarks,
            pagination: {
                totalItems: totalCount,
                totalPages: totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        }

        messageHandler.success('', 200, response)
    }catch(error){
        messageHandler.error(error.message)
    }
}

exports.create = async (req, res) => {
    const messageHandler = new MessageHandler(res)

    try{
        const { title, tags, description, category, socialmedia } = req.body
        const userId = req.userId

        if(!title)
            return messageHandler.error('Title is required !', 400)

        if(!description)
            return messageHandler.error('Description is required !', 400)

        if(!tags)
            return messageHandler.error('Tags is required !', 400)

        if(!category)
            return messageHandler.error('Category is required !', 400)

        if(!socialmedia)
            return messageHandler.error('Social media is required !', 400)

        const _category = await Category.findOne({ _id: category, user: userId })
        if(!_category)
            return messageHandler.error('The category selected isn\'t owned by the current user !', 400)
        
        const _socialmedia = await SocialMedia.findOne({ _id: socialmedia, user: userId })
        if(!_socialmedia)
            return messageHandler.error('The Social media selected isn\'t owned by the current user !', 400)

        const bookMark = await BookMark.create({
            title, tags, description, category, socialmedia
        })

        messageHandler.success('Bookmark created successfully !', 201, bookMark)
    }catch(error){
        messageHandler.error(error.message)
    }
}

exports.update = async (req, res) => {
    const messageHandler = new MessageHandler(res)

    try{
        const { id } = req.params
        const { title, tags, description, category, socialmedia } = req.body
        const userId = req.userId

        const found = await BookMark.findById(id)

        if(!found)
            return messageHandler.error('Bookmark not found !', 404)

        if(!title)
            return messageHandler.error('Title is required !', 400)

        if(!description)
            return messageHandler.error('Description is required !', 400)

        if(!tags)
            return messageHandler.error('Tags is required !', 400)

        if(!category)
            return messageHandler.error('Category is required !', 400)

        if(!socialmedia)
            return messageHandler.error('Social media is required !', 400)

        const _category = await Category.findOne({ _id: category, user: userId })
        if(!_category)
            return messageHandler.error('The category selected isn\'t owned by the current user !', 400)
        
        const _socialmedia = await SocialMedia.findOne({ _id: socialmedia, user: userId })
        if(!_socialmedia)
            return messageHandler.error('The Social media selected isn\'t owned by the current user !', 400)

        found.title = title
        found.tags = tags
        found.category = category
        found.socialmedia = socialmedia
        
        await found.save()

        messageHandler.success('Bookmark updated successfully !')
    }catch(error){
        messageHandler.error(error.message)
    }
}

exports.delete = async (req, res) => {
    const messageHandler = new MessageHandler(res)

    try{
        const { id } = req.params

        const result = await BookMark.findByIdAndDelete(id)
        if(!result)
            return messageHandler.error('BookMark not found !', 404)

        messageHandler.success('BookMark deleted successfully', 204)
    }catch(error){
        messageHandler.error(error.message)
    }
}