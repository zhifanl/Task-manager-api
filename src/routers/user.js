const express = require('express')

const User = require("../models/user")

const auth = require('../middleware/auth')

const router = new express.Router()

const multer = require('multer')

const sharp = require('sharp')

const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

//public page
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()

        sendWelcomeEmail(user.email, user.name) // send an email to the new user

        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send()

    }

})

//public page
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

//logout, need authentication
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token  // check if equal, if equal, filter it out
        })
        await req.user.save() // save

        res.send()
    } catch (e) {
        res.status(500).send()

    }
})

// post api, logout all the users
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save() // save

        res.send()
    } catch (e) {
        res.status(500).send()

    }
})


router.get('/users/me', auth, async (req, res) => { // first it will run the auth middleware for the get method
    res.send(req.user) // send auth's req.user

})

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         res.status(201).send(user)
//     } catch (e) {
//         res.status(500).send()

//     }

// })

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error: 'invalid updates' })
    }

    try {
        // const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            req.user[update] = req.body[update]

        })

        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        await req.user.remove()

        sendCancelationEmail(req.user.email, req.user.name) // send an email to the new user

        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)

    }
})

const storage = multer.memoryStorage()
const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a jpg, jpeg, png images'))
        }
        cb(undefined, true)
    },
    storage
})


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    // console.log(req.file.buffer)
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router