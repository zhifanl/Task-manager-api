const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user') // load the user router
const taskRouter = require('./routers/task') // load the user router



const app = express()
const port = process.env.PORT


app.use(express.json())
app.use(userRouter) // use the userRouter
app.use(taskRouter) // use the userRouter

//without middleware: new request-> run route handler
//with middleware: new request->do something-> run route handler

app.listen(port, () => {
    console.log('Server is on port'+ port)
})

