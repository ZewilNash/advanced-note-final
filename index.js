const express = require("express")
const userRoutes = require("./routes/user")
const noteRoutes = require("./routes/note")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()

const app = express()


app.use(express.static("./public"))
app.use(express.json())
app.options("*", cors({ origin: 'http://localhost:5000', optionsSuccessStatus: 200 }));

app.use(cors({
    origin: 'http://localhost:5000',
    optionsSuccessStatus: 200
}))
app.use(express.urlencoded({extended:true}))
app.use("/api/user" , userRoutes)
app.use("/api/note" , noteRoutes)


mongoose.connect("mongodb+srv://admin:ZDUfJfNo8rXCWWBT@cluster0.zkedy.mongodb.net/advanced-notes?retryWrites=true&w=majority")
.then(() => console.log("connected"))

app.listen(5000 , () => console.log("Server is up and running"))
