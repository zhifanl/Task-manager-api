const jwt=require('jsonwebtoken')
const User= require('../models/user')



const auth = async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user= await User.findOne({_id:decoded._id,'tokens.token':token})

        if(!user){
            throw new Error() // if cannot find one, direct to 401 page
        }
        req.token=token
        req.user=user
        next() // let router handler run
        // console.log(token)
    }catch(e){
        res.status(401).send({error:'Please authenticate.'}) // to show it is not authenticated correctly
    }
}
module.exports=auth