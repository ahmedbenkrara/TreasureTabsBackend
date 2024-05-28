class MessageHandler{

    constructor(res){
        this.res = res
    }

    success(message, statusCode = 200, data = null){
        this.res.status(statusCode).json({
            status: 'success',
            message: message,
            data: data
        })
    }

    error(message, errorCode = 500){
        this.res.status(errorCode).json({
            status: 'error',
            message: message,
            errorCode: errorCode
        })
    }
}