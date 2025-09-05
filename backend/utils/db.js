import mongoose from "mongoose"

const dbConnection = async()=>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`Mongo DB connection successful || Host ${conn.connection.host}`)
    } catch (error) {
        console.log("Error connecting Database", error)
        process.exit(1)
    }
}

export default dbConnection