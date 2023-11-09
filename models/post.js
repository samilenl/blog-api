const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        default: false,
        timestamps: true,
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: "Images",
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    topics: [{
        type: Schema.Types.ObjectId,
        ref: "Topic"
    }]
},
{
    timestamps: true
})


module.exports = mongoose.model("Post", PostSchema)