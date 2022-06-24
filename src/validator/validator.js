const mongoose = require('mongoose')


const isValid = (value) => {
    if (typeof value === "Undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "string") { return true }
    else {
        return false
    }
}


const isValidKey = (value) => {

   
    if (typeof value === "string" && value.trim().length === 0) return false;
     if (typeof value === "string") { return true }
    else {
        return false
    }
}



const isValidArray = (value) => {
    if (Array.isArray(value)) { return true }
    else {
        return false
    }
}

const isValidReqBody = function (reqBody) {
    return Object.keys(reqBody).length > 0
}

const isValidObjId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

module.exports.isValidReqBody = isValidReqBody
module.exports.isValidObjId = isValidObjId
module.exports.isValid = isValid
module.exports.isValidArray = isValidArray
module.exports.isValidKey = isValidKey
