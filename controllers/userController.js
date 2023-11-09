const asyncHandler = require("express-async-handler")
const User = require("../models/user")
const Comment = require("../models/comment")
const Post = require("../models/post")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const getWeeklyUserCounts = require("../utils/getWeeklyUserCounts")
const getWeeklyCounts = require("../utils/getWeeklyPostComCount")
require("dotenv").config()


const all_users = asyncHandler(async(req, res, next) => {
    const allUsers = await User.find().sort({name: 1}).exec()
    res.json(allUsers)
})


const user_create = asyncHandler(async(req, res, next) => {
    const name = req.body.name
    const password = req.body.password
    const password2 = req.body.confirmPassword
    const email = req.body.email

    if (!name || !password || !email) {
        return res.json({message: "User must have a name email and password"})
    }
    if (password !== password2) {
        return res.json({message: "User cannot be created: Passwords do not match"})
    }

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }
    if (!isValidEmail(email)) {
        return res.json({message: "Email is invalid"});
    } 

    const userExists = await User.findOne({email: email}).exec()
    if (userExists) {
        return res.json({message: "User cannot be created: That email is taken"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, password: hashedPassword, email })

    const payload = {
        id: user._id.toString(),
        email: user.email
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" })
    await user.save()
    res.json({user, token})

})

const user_login = asyncHandler(async(req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    if ( !password || !email ) {
        return res.json({message: "User must have an email and password"})
    }

    const user = await User.findOne({email}).select("isAdmin password").exec()

    if (!user) {
        return res.status(404).json({message: "User Not Found"})
    }

    const passwordsMatch = await bcrypt.compare(password, user.password)

    if (!passwordsMatch) {
        return res.status(404).json({message: "Incorrect Password"})
    }

    const payload = {
        id: user._id.toString(),
        email: user.email
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" })
    res.json({user, token})
})

const admin_login = asyncHandler(async(req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    if ( !password || !email ) {
        return res.json({message: "User must have an email and password"})
    }
    const user = await User.findOne({email}).select("isAdmin password").exec()
    if (!user) {
        return res.status(404).json({message: "User Not Found"})
    }
    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (!passwordsMatch) {
        return res.status(404).json({message: "Incorrect Password"})
    }
    if(!user.isAdmin){
        return res.status(403).json({message: "Only Admins can access this Page"})
    }
    const payload = {
        id: user._id.toString(),
        email: user.email
    }
    const token = jwt.sign(payload, "SecretKey", { expiresIn: "1d" })
    res.json({user, token})
})

const user_auth = (req, res, next) => {
    res.json({authenticated: true})
}

const user_get = asyncHandler(async(req, res, next) => {
    try{
        console.log(req.params.id)
        const user = await User.findOne({_id: req.params.id}).exec()
        const weeklyUserCounts = await getWeeklyUserCounts()
        const { weeklyCommentCounts, weeklyPostCounts } = await getWeeklyCounts()
        const numberOfUsers =  await User.countDocuments({}).exec()
        const numberOfComments =  await Comment.countDocuments({}).exec()
        const numberOfPublicPosts =  await Post.countDocuments({published: true}).exec()
        const numberOfPrivatePosts =  await Post.countDocuments({published: false}).exec()
        if (user) {
            res.json({
                user, 
                weeklyUserCounts, 
                weeklyCommentCounts,
                weeklyPostCounts,
                numberOfUsers,
                numberOfComments,
                numberOfPrivatePosts,
                numberOfPublicPosts
            })
        }
        else {
            res.status(400).json({message: "User does not exist"})
        }
    } catch (err) {
        res.status(400).json({message: "User does not exist"})
    }

})

const user_update = asyncHandler(async(req, res, next) => {
    const name = req.body.name
    const isAdmin = req.body.isAdmin
    if (!name) {
        return res.json({message: "User must have a name"})
    }

    const user = {name, isAdmin}
    const updatedUser = await User.findByIdAndUpdate(req.params.id, user, {new: true}).exec()
    if (updatedUser) {
        return res.json({message: "User has been updated", updatedUser})
    }
    else {
        return res.status(400).json({message: "Topic does not exist"})
    }

})


const user_delete = asyncHandler(async(req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndRemove(req.params.id).exec()
        const deletedUserComments = await Comment.deleteMany({user: req.params.id}).exec()
        const allUsers = await User.find().sort({name: 1}).exec()
        if (deletedUser) {
            res.json({deletedUser, allUsers, deletedUserComments})
        }
        else {
            res.status(400).json({message: "User does not exist"})
        }
    }
    catch (err) {
        res.status(401).json({message: err.message})
    }
})




module.exports = {
    all_users,
    user_create,
    user_login,
    admin_login,
    user_get,
    user_auth,
    user_update,
    user_delete
}