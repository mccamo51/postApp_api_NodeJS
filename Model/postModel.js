const mongoose = require("mongoose")
const User = require("../Model/userModel");
const { object, any } = require("webidl-conversions");


const postSchema = mongoose.Schema({
    title:{
        type:String,
        require
    },
    description:{
        type:String
    },
    imageUrl:{
        type:String,
        required: true
    },
    users: { type: mongoose.Schema.Types.ObjectId, ref: 'todousers' }, // Reference to User model

})

const PostModel = mongoose.model("posts", postSchema);

module.exports = PostModel;