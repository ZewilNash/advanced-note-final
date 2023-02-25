const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        index:true,
        sparse:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    },
    user_image:{
        type:String
    },

    user_name:{
        type:String , 
        unique:true
    },

    token:{
        type:String
    },

    notes:[
        {type:mongoose.Schema.Types.ObjectId , ref:"Note"}
    ]
})

module.exports = mongoose.model("User" , userSchema)