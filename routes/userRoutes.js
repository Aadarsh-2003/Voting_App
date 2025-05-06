import User from "../models/user.js";
import express from 'express';
import { jwtMiddleware, generateToken } from "../jwt.js";

const router = express.Router();


router.post('/signup', async(req,res)=>{
    try {
        const data = req.body;
        const newUser = new User(data);

        const savedUser = await newUser.save();
        console.log('User Saved successfully');

        const token = generateToken(savedUser.name);
        console.log('token is :', token);

        res.status(200).json({response:savedUser , token:token});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }   
});

router.post('/login', async(req,res)=>{
    try {
        const {aadharCardNum,password} = req.body;

        const loginUser = await User.findOne({aadharCardNum:aadharCardNum});
        if(!loginUser || !(await loginUser.comparePassword(password))){
            return res.status(401).json({error:'Invalid aadharcard number or password'});
        }

        const payload = {
            id : loginUser.id,
            username : loginUser.name
        }

        console.log( "payload is :", payload);

        const token = generateToken(payload);

        //return token as response
        res.json({token:token});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }   
});

router.get('/profile', jwtMiddleware ,async (req,res)=>{
    try {
        const userData = req.user;
        console.log('userdata found is :', userData)
        const userId = userData.id;
        console.log('userId found is :', userId)
        const user = await User.findById(userId); 
        console.log('user found is :', user) 

        res.status(200).json({response:user});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }
});

router.put('/profile/password', jwtMiddleware, async(req,res)=>{
    try {
        const userId = req.user.id;
        const {currentPassword , newPassword} = req.body;

        const user = await User.findById(userId);

        if(!(await user.comparePassword(currentPassword))){
            res.status(401).json({error:'Invalid password'});
        }

        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({message: 'password updated successfully'});

    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }
});

export default router;
