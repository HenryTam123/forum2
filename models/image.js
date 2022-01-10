const mongoose = require('mongoose')

const imageSchema = mongoose.Schema({
    selectedFile: String
})

const Image = mongoose.model('Image', imageSchema)

module.exports = Image