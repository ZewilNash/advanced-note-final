const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    note:{
        type:String,
        required:true,
        unique:true
    },

    time:{
        type:String,
    },

    isChecked:{
        type:Boolean,
        default:false
    },

    created_at:  { type: Date, default: Date.now },
    updated_at:  { type: Date, default: Date.now },

    user:[{type:mongoose.Schema.Types.ObjectId , ref:"User"}],
   
})


module.exports = mongoose.model("Note" , noteSchema)