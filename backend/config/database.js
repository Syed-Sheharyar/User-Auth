const mongoose = require("mongoose")

const connectDb = ()=>{
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(res => console.log("Connected to mongoDB successfully")).catch((err) => console.log(`Something went wrong ${err.message}`))
}

module.exports = connectDb