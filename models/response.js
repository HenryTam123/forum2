const mongoose = require('mongoose')

const responseSchema = mongoose.Schema({
    responseContent: String,
    creator: String
})

const Response = mongoose.model('Response', responseSchema)

module.exports = Response