const mongoose = require("mongoose")
require("dotenv").config()

const mongoDB = process.env.MONGODB_URI;

const connectDB = async()  => {
    try {
        await mongoose.connect(mongoDB, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
          });
        console.log(`Successfully connected to Database`);
    } 
    catch (error) {
        console.log(error);
    }
}

module.exports = connectDB