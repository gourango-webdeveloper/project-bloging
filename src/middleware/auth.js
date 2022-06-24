const jwt = require("jsonwebtoken")

let authenticate = async function (req, res, next) {
    try {
        let token = req.headers["x-auth-token"]
        if (!token) {
            res.status(404).send({ status: false, msg: "token must be present" })
        }
        else {
            try {
                jwt.verify(token, "functionup-Project-1-Blogging-Room-18")
                next()
            }
            catch (error) {
                res.status(403).send({ status: false, msg: "Invalid token" })
            }
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

let authorise = async function (req, res, next) {
    try {
        const authorIdParams = req.params.authorId
        const authorIdQuery = req.query.authorId
        const authorIdBody = req.body.authorId
        const authorIdHeaders = req.headers.authorId
        const token = req.headers["x-auth-token"]
        let decodedToken = jwt.verify(token, "functionup-Project-1-Blogging-Room-18")
        if (authorIdParams == decodedToken.authorId ||
            authorIdQuery == decodedToken.authorId ||
            authorIdBody == decodedToken.authorId ||
            authorIdHeaders == decodedToken.authorId) {
            next()
        }
        else {
            res.status(401).send("Authorization failed")
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.authenticate = authenticate
module.exports.authorise = authorise