const asyncHandler = require("express-async-handler")
const Topic = require("../models/topic")
const Post = require("../models/post")

const all_topics = asyncHandler(async(req, res, next) => {
    const allTopics = await Topic.find().sort({title: 1}).exec()
    res.json(allTopics)
})

const topic_create = asyncHandler(async(req, res, next) => {
    const title = req.body.title
    if (!title)  {
        return res.json({message: "A topic must have a title"})
    }
    const topicExists = await Topic.findOne({title}).exec()
    if (topicExists){
        return res.json({message: "A Topic with that title already exists"})
    }
    const topic = new Topic({title})
    await topic.save()
    res.json({message: "Topic has been created", topic})
})

const topic_update = asyncHandler(async(req, res, next) => {
    const title = req.body.title
    if (!title)  {
        return res.json({message: "A topic must have a title"})
    }
    const topic = new Topic({title, _id: req.params.id})
    const updatedTopic = await Topic.findByIdAndUpdate(req.params.id, topic, {new: true}).exec()
    if (updatedTopic) {
        return res.json({message: "Topic has been updated", updatedTopic})
    }
    else {
        return res.status(400).json({message: "Topic does not exist"})
    }
    
})

const topic_get = asyncHandler(async(req, res, next) => {
    try {
        const topic = await Topic.findOne({_id: req.params.id})
        const postWithTopic = await Post.find({topics: req.params.id})
        if (topic) {
            res.json({topic, postWithTopic})
        }
        else {
            res.status(401).json({message: "Topic not found"})
        }
    }
    catch (err) {
        res.status(401).json({message: err.message})
    }
})

const topic_delete = asyncHandler(async(req, res, next) => {
    try {
        const deletedTopic = await Topic.findByIdAndRemove(req.params.id).exec()
        // add functonality that makes sure when you delete 1 topic
        // every post referencing that topic has the topic removed from its list of topics
        // this pulls out every topic in my topics list in my document
        // that has thesame id with the topic im deleting
        const update = { $pull: { topics: { $in: [ req.params.id ] } } }
        const query = { topics: req.params.id }
        const allPostsWithTopic = await Post.updateMany(query, update).exec()

        const allTopics = await Topic.find().sort({title: 1}).exec()
        if (deletedTopic) {
            res.json({deletedTopic, allTopics, allPostsWithTopic})
        }
        else {
            res.status(401).json({message: "Topic does not exist"})
        }
    }
    catch (err) {
        res.status(401).json({message: err.message})
    }
})




module.exports = {
    all_topics,
    topic_create,
    topic_update,
    topic_get,
    topic_delete
}