const mongoose = require("mongoose")

const connectDb = ()=>{
    mongoose.connect(process.env.DB_URI).then(res => console.log("Connected to mongoDB successfully")).catch((err) => console.log(`Something went wrong ${err.message}`))
}

module.exports = connectDb