const express = require('express')
const Category = require('../models/category.js')

categoryApis = {
    getAllCategories: async function (req, res) {
        try {
            const categories = await Category.find()
            res.status(200).json(categories)

        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    },

    createCategory: async function (req, res) {
        const category = req.body
        const newCategory = new Category(category)
        try {
            newCategory.save()
            res.status(201).json(newCategory)
        } catch (err) {
            res.status(409).json({ message: err.message })
        }
    }

}

module.exports = categoryApis