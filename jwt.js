import jwt from 'jsonwebtoken';

export const jwtMiddleware = (req,res,next)=>{

    //first check request header has authorization or not
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error:'Unauthorized'});


    const token = authorization.split(' ')[1];
    if(!token) return res.status(401).json({error:'unauthorized'});
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({error: 'invalid token'});
    }
};

export const generateToken = (userData)=>{
    return jwt.sign(userData,process.env.JWT_SECRET);   
}
