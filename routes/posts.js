const express = require('express')
const mongodb = require('mongodb')
const PostMessage = require('../models/PostMessage.js')
const Category = require('../models/category.js')
const Response = require('../models/response.js')
const ObjectId = mongodb.ObjectID


postApis = {
    // fetch all posts by category
    getPosts: async function (req, res) {

        const cat = req.query.cat

        console.log(cat)

        try {
            const postMessages = await PostMessage.find()
            res.status(200).json(postMessages)

        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    },

    postPost: async function (req, res) {
        try {

            const { creator, title, category } = req.body

            let newPost = new PostMessage({
                creator: creator,
                title: title,
                category: category
            })

            let createdPost = await newPost.save()
            console.log(createdPost)

            let updatedCategory = Category.findOneAndUpdate({ category: category }, { '$push': { 'posts': ObjectId(createdPost._id) } }, (err, doc) => {
                console.log(doc)
            })

            console.log(newPost)

            res.status(200).json(newPost)

        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    },

    // fetch a specific post 
    getSpecificPost: async function (req, res) {
        const { id } = req.body
        try {
            // get information of a post
            const postMessages = await PostMessage.find({ _id: id })

            res.status(200).json(postMessages)

        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    },

    // get all comments of a post
    getAllComments: async function (req, res) {
        try {

            const { postId } = req.body;

            const postMessages = await PostMessage.findOne({ _id: postId })

            const responses = await Response.find({ "_id": { $in: postMessages.response } })

            res.status(200).json(responses)

        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    },

    // post comment to a post
    postComment: async function (req, res) {
        const response = req.body.response
        const newResponse = new Response(response)

        try {
            await newResponse.save()

            await PostMessage.findOne({ "_id": ObjectId(response.id) }, (err, matchedPost) => {
                if (matchedPost) {
                    console.log(matchedPost)
                    matchedPost.response.push(newResponse)
                    matchedPost.save()
                }
            })
            const postMessage = await PostMessage.find({ "_id": ObjectId(response.id) })
            res.status(201).json(postMessage)

        } catch (err) {
            res.status(409).json({ message: err.message })
        }
    },

    // like a post
    likePost: async function (req, res) {
        const username = req.body.data.username
        const id = req.body.data.id

        try {
            await PostMessage.findOne({ "_id": ObjectId(id) }, (err, matchedPost) => {
                if (matchedPost.likeCount.includes(username)) {
                    matchedPost.likeCount.splice(matchedPost.likeCount.indexOf(username), 1)
                } else {
                    matchedPost.likeCount.push(username)
                }
                matchedPost.save()
                res.status(200).json(matchedPost)
            })
        } catch (err) {
            req.json({ message: err })
        }
    },

    // dislike a post
    dislikePost: async function (req, res) {
        const username = req.body.data.username
        const id = req.body.data.id

        try {
            await PostMessage.findOne({ "_id": ObjectId(id) }, (err, matchedPost) => {
                if (matchedPost.dislikeCount.includes(username)) {
                    matchedPost.dislikeCount.splice(matchedPost.dislikeCount.indexOf(username), 1)
                } else {
                    matchedPost.dislikeCount.push(username)
                }
                matchedPost.save()
                res.status(200).json(matchedPost)
            })
        } catch (err) {
            req.json({ message: err })
        }
    }
}
module.exports = postApis