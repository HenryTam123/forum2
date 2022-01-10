const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    category: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostMessage" }],
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category;