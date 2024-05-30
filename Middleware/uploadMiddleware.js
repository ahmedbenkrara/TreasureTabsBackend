const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        let filename = 'uploads/' + file.fieldname + '-' + uniqueSuffix + '-' + file.originalname
        cb(null, filename)
    }
})

const upload = multer({ storage: storage })

module.exports = {
    uploadSingle: upload.single('file'),
    uploadMultiple: upload.array('files', 10),
    uploadFields: (fields) => upload.fields(fields)
}