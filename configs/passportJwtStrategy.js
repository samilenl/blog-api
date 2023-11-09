const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("../models/user")
require("dotenv").config()

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
}
  
  
const strategy = new JwtStrategy(jwtOptions, async(payload, done) => {
    try {
      const user = await User.findOne({_id: payload.id}).exec()
      if (user){
        done(null, user)
      } 
      else {
        done(null, false, {message: "User not found"})
      }
    }
    catch (err) {
      done(null, false, {message: err.message})
    }
})


module.exports = strategy