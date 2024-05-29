const path = require('path')
const Category = require(path.join(__dirname, '..', 'Models', 'Category'))
const MessageHandler = require(path.join(__dirname, '..', 'utils', 'responses', 'MessageHandler'))

//must be guarded role user
exports.create = async (req, res) => {
    const messageHandler = new MessageHandler(res)
    
    try{
        const name = req.body.name
        const user = req.userId //comes from middleware

        if(!name)
            return messageHandler.error('Category name is required !', 400)

        const category = await Category.create({
            name,
            user 
        })

        if(!category)
            return messageHandler.error('Something went wrong please try again later !')
        
        messageHandler.success('Category created successfully !', 201)
    }catch(error){
        messageHandler.error(error.message)
    }
}

exports.delete = async (req, res) => {
    const messageHandler = new MessageHandler(res)

    try{
        const { id } = req.params

        const result = await Category.findByIdAndDelete(id)
        if(!result)
            return messageHandler.error('Category not found !', 404)

        messageHandler.success('Category deleted successfully', 204)
    }catch(error){
        messageHandler.error(error.message)
    }
}