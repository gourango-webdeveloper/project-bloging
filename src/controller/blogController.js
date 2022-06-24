const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const mongoose = require('mongoose')
const validator = require('../validator/validator')

const createBlog = async function (req, res) {
    try {
        let data = req.body
        let id = req.body.authorId
        if (!validator.isValidReqBody(data)) {
            return res.status(400).send({ status: false, msg: "invalid request put valid data in body" })
        }
        const { title, body, authorId, category, isPublished, tags, subcategory } = data
        if (!validator.isValidArray(tags)) {
            return res.status(400).send({ status: false, msg: "tags must be a character in aaray" })
        }
        if (!validator.isValidArray(subcategory)) {
            return res.status(400).send({ status: false, msg: "subcategory must be a character in aaray" })
        }
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, msg: "title required" })
        }
        if (!validator.isValid(body)) {
            return res.status(400).send({ status: false, msg: "body Required" })
        }
        if (!validator.isValid(authorId)) {
            return res.status(400).send({ status: false, msg: "authorId required" })
        }
        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, msg: "category required" })

        }
        if (isPublished !== true) {

            return res.status(400).send({ status: false, msg: "not Published " })
        }
        if (!validator.isValidObjId(authorId)) {
            return res.status(400).send({ status: false, msg: "AuthorId invalid" })
        }
        const findAuthor = await authorModel.findById(id)
        if (!findAuthor) {
            return res.status(400).send("Auther not exists")
        }
        let saveData = await blogModel.create(data)
        return res.status(201).send({ status: true, msg: "Blog created succesfully", saveData })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const getBlog = async function (req, res) {
    try {
        let blogs = await blogModel.find({ isDeleted: false, isPublished: true });
        if (blogs.length === 0) {
            return res.status(404).send({ status: false, msg: "blogs not found" });
        }
        console.log(blogs)
        let authorId = req.query.authorId;
        const { category, tag, subcategory } = req.query

        let temp = []
        for (let i = 0; i < blogs.length; i++) {
            let x = blogs[i];

            if ((x.authorId.toString() === authorId)) {
                temp.push(x)
            }
            if ((x.category === category)) {
                temp.push(x)
            }
            if ((x.subcategory.includes(subcategory))) {
                temp.push(x)
            }
            if (x.tags.includes(tag)) {
                temp.push(x)
            }
        }
        if (temp.length === 0) {
            res.status(404).send({ status: false, msg: "data not found" })
        }
        else res.send({ status: true, Data: temp })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

const updateBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId
        const data = req.body
        const { title, body, tags, category, subcategory } = data
        if (!validator.isValidObjId(blogId)) {
            return res.status(400).send({ status: false, msg: "blogId is invalid" })
        }
        if (!validator.isValidReqBody(data)) {
            return res.status(400).send({ status: false, msg: "invalid request put valid data in body" })
        }
        if (title) {
            if (!validator.isValid(title)) { return res.status(400).send({ status: false, msg: "title required" }) }
        }
        if (body) {
            if (!validator.isValid(body)) { return res.status(400).send({ status: false, msg: "body Request" }) }
        }
        if (tags) {
            if (!validator.isValidArray(tags)) { return res.status(400).send({ status: false, msg: "tags elements required" }) }
        }
        if (category) {
            if (!validator.isValid(category)) { return res.status(400).send({ status: false, msg: "category Required" }) }
        }
        if (subcategory) {
            if (!validator.isValidArray(subcategory)) {
                return res.status(400).send({ status: false, msg: "subcategory required" })
            }
        }
        if (tags.length === 0) { return res.status(400).send({ status: false, msg: "Provide tag" }) }
        if (subcategory.length === 0) { return res.status(400).send({ status: false, msg: " provide subcategory " }) }
        let updatedata = await blogModel.findOneAndUpdate({ _id: blogId }, { published: true, publishedAt: new Date(), data }, { new: true })
        return res.status(200).send({ status: true, data: updatedata })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const deleteBlogById = async function (req, res) {
    try {
        const bloggId = req.params.blogId
        if (mongoose.Types.ObjectId.isValid(bloggId)) {
            const bloggDetails = await blogModel.findById(bloggId)
            if (!bloggDetails) {
                res.status(404).send({ status: false, msg: "Blogg Data is Not Available" })
            }
            else {
                if (bloggDetails.isDeleted === true) {
                    res.status(400).send({ status: false, msg: "Data Already Deleted" })
                }
                else {
                    await blogModel.findByIdAndUpdate({ _id: bloggId }, { isDeleted: true, deletedAt: new Date() })
                    res.status(200).send()
                }
            }
        }
        else {
            res.status(400).send({ status: true, msg: "Blogg ID is Not Valid" })
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const deleteBlogByQueryParams = async function (req, res) {
    try {
        const data = req.query
        const { category, authorId, isPublished } = data
        const tagsData = req.query.tags
        const subcategoryData = req.query.subcategory
        if (!Object.keys(data).length == 0) {
            if (authorId || authorId === "") {
                if (!mongoose.Types.ObjectId.isValid(authorId)) {
                    return res.status(400).send({ status: false, msg: "invalid AuthorID" })
                }
            }
            const bloggDetails = await blogModel.find({
                $or: [{
                    category
                },
                { authorId },
                { tags: { $in: tagsData } },
                { isPublished },
                { isDeleted: false },
                {
                    subcategory: {
                        $in: subcategoryData,
                    }
                }]
            })
            if (Object.keys(bloggDetails).length === 0) {
                res.status(404).send({ status: false, msg: "Blog Data is Not Available" })
            }
            else {
                await blogModel.updateMany({
                    $or: [{
                        category
                    },
                    { authorId },
                    { tags: { $in: tagsData } },
                    { isPublished },
                    { isDeleted: false },
                    {
                        subcategory: {
                            $in: subcategoryData,
                        }
                    }]
                },
                    { isDeleted: true, deletedAt: new Date() })
                res.status(200).send()
            }
        }
        else {
            res.status(400).send({ status: false, msg: "require data not matched" })
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlogById = deleteBlogById
module.exports.deleteBlogByQueryParams = deleteBlogByQueryParams