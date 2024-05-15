// require('dotenv').config({path: './env'})

import dotenv from "dotenv"

import connectDB from "./db/index.js";

import { app } from "./app.js"

dotenv.config({
    path: './env'
})

connectDB()
.then(
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at prot : ${process.env.PORT}`)
        app.on("error", (err) => {
            console.error("Server running error: ",err)
            throw err
        })
    })
)
.catch((err)=>{
    console.log("Mongodb connection failed !!!",err);
})