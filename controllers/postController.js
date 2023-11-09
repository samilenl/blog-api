const asyncHandler = require("express-async-handler")
const Post = require("../models/post")
const Comment = require("../models/comment")
const mongoose = require("mongoose")


const all_posts = asyncHandler(async(req, res, next) => {
    const allPosts = await Post.find().sort({title: 1}).populate("topics").populate("author").exec()
    const commentCount = []
    for (const post of allPosts) {
        const count = await Comment.countDocuments({post: post._id}).exec()
        commentCount.push({_id: post._id, count: count})
    }
    res.json({allPosts, commentCount})
})

const recent_posts = asyncHandler(async(req, res, next) => {
    try {
        const recentPosts = await Post.find({published: true}).sort({updatedAt: -1}).populate("topics").populate("author").limit(6).exec()
        const commentCount = []
        for (const post of recentPosts) {
            const count = await Comment.countDocuments({post: post._id}).exec()
            commentCount.push({_id: post._id, count: count})
        }
        res.json({recentPosts, commentCount})
    } catch (error) {
        res.status(401).json({error})
}
})

const public_posts = asyncHandler(async(req, res, next) => {
    const allPosts = await Post.find({published: true}).sort({title: 1}).populate("topics").populate("author").exec()
    const commentCount = []
    for (const post of allPosts) {
        const count = await Comment.countDocuments({post: post._id}).exec()
        commentCount.push({_id: post._id, count: count})
    }
    res.json({allPosts, commentCount})
})


const post_create = [
    (req, res, next) => {
        if (req.body.topics) {
            if (typeof req.body.topics !== Array) {
                req.body.topics = [ req.body.topics ]
                next()
            }
        } else {
            req.body.topics = []
            next()
        }
    },
        
    asyncHandler(async(req, res, next) => {
        console.log(req.file)
        try {   
            const title = req.body.title
            const author = req.user._id
            const text = req.body.text
            const topics = req.body.topics
            const image = req.file ? req.file.id : null

            const postExists = await Post.findOne({title}).exec()
            if (postExists){
                return res.json({message: "A Post with that title already exists"})
            }
            const post = new Post({title, text, author, topics, image})
            await post.save()
            res.json({message: "Post has been created", post})
        }
        catch (err) {
            res.json({message: err.message})
        }

    })
]


const image_get = asyncHandler(async(req, res, next) => {
    try{
        const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "Images" })
        const file = await gfs.find({_id: new mongoose.Types.ObjectId(req.params.id) }).toArray();
        if (file.length < 1) {
             return res.status(404).json({ error: 'Image not found' });
        }
        res.set('Content-Type', file[0].contentType);
        const readStream = gfs.openDownloadStream( new mongoose.Types.ObjectId(req.params.id));
        readStream.pipe(res)
    } catch(err) {
        res.status(401).json({message: err.message})
    }
})


const post_get = asyncHandler(async(req, res, next) => {
    try{
        const post = await Post.findOne({_id: req.params.id}).populate("author").populate("topics").exec()
        const postComments = await Comment.find({post: req.params.id}).populate("user").exec()
        if (post) {
            res.json({post, postComments})
        }
        else {
            res.status(404).json({message: "Post not found"})
        }
    } catch(err) {
        res.status(401).json({message: err.message})
    }
})


const post_update = [
    (req, res, next) => {
        if (req.body.topics) {
            if (typeof req.body.topics !== Array) {
                req.body.topics = [ req.body.topics ]
                next()
            }
        } else {
            req.body.topics = []
            next()
        }
    },
    
    asyncHandler(async(req, res, next) => {
        const image = req.file ? req.file.id : null 
        let updateObj;
        try {
            if (image) {
                updateObj = {
                    title: req.body.title,
                    text: req.body.text,
                    topics: req.body.topics,
                    published: req.body.published ? req.body.published : false,
                    image,
                    topics: req.body.topics ? req.body.topics : "",
                    _id: req.params.id
                }
            }
            else {
                updateObj = {
                    title: req.body.title,
                    text: req.body.text,
                    topics: req.body.topics,
                    published: req.body.published ? req.body.published : false,
                    topics: req.body.topics ? req.body.topics : "",
                    _id: req.params.id
                }
            }

            const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateObj, { new: true }).exec()
            const allPosts = await Post.find().sort({title: 1}).exec()
            if (updatedPost) {
                return res.json({updatedPost, allPosts})
            }
            else {
                return res.status(400).json({message: "Post does not exist"})
            }
        } 
        catch(err) {
            res.status(401).json({message: err.message})
        }
    })
]


const post_delete = asyncHandler(async(req, res, next) => {
    try {
        const deletedPost = await Post.findByIdAndRemove(req.params.id).exec()
        const allPosts = await Post.find().sort({title: 1}).exec()
        // add functonality that makes sure when you delete 1 post
        // every comment referencing that post is deleted
        const deletedPostComments = await Comment.deleteMany({post: req.params.id}).exec()
        if (deletedPost) {
            res.json({deletedPost, allPosts, deletedPostComments})
        }
        else {
            res.status(400).json({message: "Post does not exist"})
        }
    } 
    catch(err) {
        res.status(401).json({message: err.message})
    }
})




module.exports = {
    all_posts,
    recent_posts,
    public_posts,
    post_create,
    post_get,
    image_get,
    post_update,
    post_delete
}