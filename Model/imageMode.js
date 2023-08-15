const mongoose = require("mongoose")

const ImageSchema = mongoose.Schema(
    {
        name:{
            type:String,
            require
        },
        image:{
            data:Buffer,
            contentType:String
        }
    }
)

const ImageModel = mongoose.model("image", ImageSchema);
module.exports = ImageModel;