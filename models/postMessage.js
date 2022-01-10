const mongoose = require('mongoose')


const postSchema = mongoose.Schema({
    title: String,
    message: String,
    creator: String,
    category: String,
    selectedFile: String,

    likeCount:
        [{ type: String }]
    ,
    dislikeCount:
        [{ type: String }]
    ,
    createdAt: {
        type: Date,
        default: new Date()
    },
    response:
        [{ type: mongoose.Schema.Types.ObjectId, ref: "Response" }]

})



const PostMessage = mongoose.model('PostMessage', postSchema)

module.exports = PostMessage;