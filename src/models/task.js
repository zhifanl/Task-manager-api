const mongoose = require('mongoose')

const  taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim:true,
        required:true
    },
    completed: {
        type: Boolean,
        default:false
    },
    // owner added for mapping to the user
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true // timestamp for created time and updated time
})

const Task = mongoose.model('Task', taskSchema)

module.exports=Task
