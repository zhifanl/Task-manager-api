# **Task Manager App**
#### Created by Zhifan (Tom) Li in Summer 2021
### ***Technology used:***

- Backend developed in Node.js, Express.js
- REST API
- Postman
- MongoDB, Mongoose ODM, MongoDB Atlas
- API authentications and security
- Passwords stored in database are all encrypted (hashed)
- Deployed on cloud server and used git to track the update of the project
- SendGrid API is integrated to send email to users
- Server deployed on Heroku
---
### ***key functionalities:***

- Log in/out, update, delete account option for users
- Allow users to create/read/update/delete their tasks
- Each users has his/her own task logs in their database that nobody else can access them
- Allow users to upload files to the server.
- Allow users to do filtering, paginating, sorting for their data
- Allow users to send emails by calling the SendGrid API.
---
### ***Use POSTMAN to interact with DB:***
- Link of server https://tom-task-manager-api.herokuapp.com/, which is the {{url}} for postman
- By passing raw JSON data in the body session to the server. (For files, pass form-data)
- Create user: POST: https://tom-task-manager-api.herokuapp.com/users (fields needed: name, email, password)
- Create Task: POST: https://tom-task-manager-api.herokuapp.com/tasks (fields needed: description)
- Login user: POST: https://tom-task-manager-api.herokuapp.com/users/login (fields needed: email, password)
- Logout user: POST: https://tom-task-manager-api.herokuapp.com/users/logout (fields not needed)
- Logout All users: POST: https://tom-task-manager-api.herokuapp.com/users/logoutAll (fields not needed)
- Read Current user profile: GET: https://tom-task-manager-api.herokuapp.com/users/me (fields not needed)
- Update Current user: PATCH: https://tom-task-manager-api.herokuapp.com/users/me (fields: age, name, email, password, _id)
- Update Current task: PATCH: https://tom-task-manager-api.herokuapp.com/tasks/{{task id}} (fields needed: description, completed, owner, _id)
- Delete Current user: DELETE: https://tom-task-manager-api.herokuapp.com/users/me (fields not needed)
- Delete Current task: DELETE: https://tom-task-manager-api.herokuapp.com/tasks/{{task id}} (fields needed: _id)
- Upload a file: POST: https://tom-task-manager-api.herokuapp.com/upload
- Upload an avatar for current user: POST: https://tom-task-manager-api.herokuapp.com/users/me/avatar
- Delete the avatar for current user: DELETE: https://tom-task-manager-api.herokuapp.com/users/me/avatar