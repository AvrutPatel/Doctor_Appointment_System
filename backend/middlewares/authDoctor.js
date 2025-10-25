import jwt from 'jsonwebtoken';

const authDoctor = async (req,res,next)=>{
    try{
        const {dtoken}=req.headers;
        if(!dtoken){
            return res.json({success:false,message:"Not Authorised Login again"});
        }
        const token_decode=jwt.verify(dtoken,process.env.JWT_SECRET)
        req.body.docId=token_decode.id
        next();
    }catch(err){
        console.log(err);
        res.json({success:false,message:err.message});
    }
}

export default authDoctor