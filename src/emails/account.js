const sgMail=require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY) //use its environment var ( the API key )

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'tom@aishading.com',
        subject:'Thanks for joining in!',
        text:`Welcome to the app, ${name}. Let me know how you get along with the app.`
        
    }) 
}

const sendCancelationEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'tom@aishading.com',
        subject:'Sorry to see you go',
        text:`Goodbye, ${name}. I hope to see you back some time soon.`
        
    })
}


module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}  