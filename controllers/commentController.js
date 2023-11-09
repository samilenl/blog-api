const asyncHandler = require("express-async-handler")
const Comment = require("../models/comment")
const Post = require("../models/post")
const User = require("../models/user")


const comment_create = asyncHandler(async(req, res, next) => {
    try {
        const text = req.body.text
        const user = req.user._id
        const post = req.params.postID

        if (req.body.text === "" || !req.body.text) {
            return res.json({message: "Comment Text must not be empty"})
        }

        const userExists = await User.findOne({ _id: user }).exec()

        if (!userExists){
            return res.status(401).json({message: "User does not exist, so you cannot create a comment"})
        }

        const postExists = await Post.findOne({_id: post}).exec()
        if (!postExists){
            return res.status(401).json({message: "Post does not exist"})
        }

        const comment = new Comment({ text, user, post })
        const savedComment = await comment.save()
        const thePost = await Post.findById(post)
        res.json({savedComment, thePost})
    }
    catch (err) {
        res.status(401).json({message: err.message})
    }

})

const comment_get = asyncHandler(async(req, res, next) => {
    try{
        const post = await Post.findOne({_id: req.params.id}, {title: 1}).exec()
        const comments = await Comment.find({post: req.params.id}).populate("user").exec()
        if (comments) {
            res.json({comments, post})
        }
        else {
            res.status(404).json({message: "Comment not found"})
        }
    }
    catch (err) {
        res.status(401).json({message: err.message})
    }

})


const comment_update = asyncHandler(async(req, res, next) => {
    try {
        if (req.body.text === "" || !req.body.text) {
            return res.json({message: "Comment Text must not be empty"})
        }
        const updateObj = { text: req.body.text }
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, updateObj, { new: true }).exec()
        const allComments = await Comment.find({post: updatedComment.post}).exec()
        if (updatedComment) {
            res.json({updatedComment, allComments})
        }
        else {
            res.status(400).json({message: "Comment does not exist"})
        }
    }
    catch (err) {
        res.status(401).json({message: err.message})
    }

})


const comment_delete = asyncHandler(async(req, res, next) => {
    try {
        const deletedComment = await Comment.findByIdAndRemove(req.params.id).exec()
        const allComments = await Comment.find({post: deletedComment.post}).exec()
        if (deletedComment) {
            res.json({deletedComment, allComments})
        }
        else {
            res.status(400).json({message: "Comment does not exist"})
        }
    }
    catch (err) {
        res.status(401).json({message: err.message})
    }

})




module.exports = {
    comment_create,
    comment_get,
    comment_update,
    comment_delete
}