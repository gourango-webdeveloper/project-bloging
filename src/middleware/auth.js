const jwt = require("jsonwebtoken")
const authorModel = require("../models/authorModel")

let authenticate = async function (req, res, next) {
    try {
        let token = req.headers["x-auth-token"]
        if (!token) {
            res.status(404).send({ status: false, msg: "token must be present" })
        }
        else {
            let decodedToken = jwt.verify(token, "functionup-Project-1-Blogging-Room-18")
            if (!decodedToken) {
                res.status(400).send({ status: false, msg: "token is invalid" })
            }
            else {
                next()
            }
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

let authorise = async function (req, res, next) {
    try {
        let authorIdParams = req.params.authorId
        let authorIdQuery = req.query.authorId
        let authorIdBody = req.body.authorId
        let token = req.headers["x-auth-token"]
        let decodedToken = jwt.verify(token, "functionup-Project-1-Blogging-Room-18")
        if (authorIdParams === decodedToken.authorId || authorIdQuery === decodedToken.authorId || authorIdBody === decodedToken.authorId) {
            next()
        }
        else {
            res.status(401).send("User not valid")
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.authenticate = authenticate
module.exports.authorise = authorise