const request = require('supertest')

const app =require('../src/app')

const User= require('../src/models/user')

const jwt=require('jsonwebtoken')

const mongoose=require('mongoose')

const userOneId=new mongoose.Types.ObjectId()

const userOne={
    _id:userOneId,
    name:"Mile",
    email:"mike@aaaad.com",
    password:"annnnnnn",
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}
beforeEach(async()=>{
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should sign up new user',async()=>{
    const response= await request(app).post('/users').send({
        name:'Tom',
        email:'tom11a@aishading.com',
        password:'77777777'
    }).expect(201)

    const user=await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(user.password).not.toBe('77777777')
})

test('Should login existing user',async()=>{
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
})

test('Should not login non-existing user',async()=>{
    await request(app).post('/users/login').send({
        email:"non-existing@email.com",
        password:userOne.password
    }).expect(400)
})

test('Should get profile for user',async()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user',async()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user',async()=>{
    await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not delete account for unauthenticated user',async()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar',async()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)
})

test('Should upload valid user fields',async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'jess'
    })
    .expect(200)
})