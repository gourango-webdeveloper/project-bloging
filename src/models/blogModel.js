const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema( {
    title : { type : String , required : true },
    body : { type :  mongoose.Schema.Types.Mixed , required : true },
    authorId : {type : mongoose.Schema.Types.ObjectId,
                ref : "author",
                required :true,
               },
    tags : [String],
    category : {type: String , required : true },
    subcategory : { type : [String], },
    deletedAt : String,
    isDeleted : { type : Boolean , default : false},
    publishedAt : String ,
    isPublished : { type : Boolean , default : false }           
}, {timestamps : true});

module.exports = mongoose.model("blog", blogSchema);