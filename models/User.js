const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    email: String,
    picture: String,
    level: {
        type: Number,
        default: 1
    },
    icon: { type: String, default: '' },
    joinedAt: { type: Date, default: new Date() }
})

const User = mongoose.model('User', userSchema)

module.exports = User