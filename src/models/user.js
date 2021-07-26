const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true, // make the email unique for all users
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password" ')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }], // array of tokens
    avatar: {
        type: Buffer 
    }
}, {
    timestamps: true // add time stamp, created, updated
})

//*** virtual property
userSchema.virtual('tasks', {
    ref: 'Task', // reference to Task
    localField: '_id', // _id field holds the relationship between task owner field
    foreignField: 'owner'// name of field on task side
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token: token })
    await user.save() // wait for user to save, save it to database
    return token

}

// this function serves as getting the object it receives and hide the password and token part for security
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password // hide the password
    delete userObject.tokens // hide the tokens
    delete userObject.avatar // hide the avatar, because it slows down the speed of server

    return userObject
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user

}


// this provides middleware for users to hash their password to be more secure
// everytime user modify their password, their password will be hashed again
userSchema.pre('save', async function (next) {
    const user = this
    //console.log('just before saving')
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User