const app = require("./app")
const dotenv = require("dotenv")
const connectDb = require("./config/database")

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error ${err.message}`);
    console.log('Server shutdown due to Uncaught Exception');
    process.exit(1)
})

// dotenv  config
dotenv.config({ path: "backend/config/.env.local" })

// Connecting to Database
connectDb()

module.exports = app

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error ${err.message}`);
    console.log('Server shutdown due to Unhandled Promise Rejection');

    server.close(() => {
        process.exit(1)
    })
})
