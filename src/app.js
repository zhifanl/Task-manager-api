const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user') // load the user router
const taskRouter = require('./routers/task') // load the user router



const app = express()


app.use(express.json())
app.use(userRouter) // use the userRouter
app.use(taskRouter) // use the userRouter

module.exports=app
