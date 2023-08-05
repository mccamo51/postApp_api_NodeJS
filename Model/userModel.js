const mongoose = require("mongoose")


const userSheme = mongoose.Schema({
    phone:{
        type:String,
        require
    },
    password:{
        type:String,
        require
    },
    name:{
        type:String,
        require
    },
    
})
const User = mongoose.model("todoUser", userSheme);
module.exports = User