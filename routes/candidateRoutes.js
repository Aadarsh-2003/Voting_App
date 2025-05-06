import Candidate from "../models/candidate.js";
import User from "../models/user.js"
import express from 'express';
import { jwtMiddleware, generateToken } from "../jwt.js";

const router = express.Router();

const checkAdminRole = async (userId)=>{
    try { 
        const user = await User.findById(userId);

        if(user.role === "admin"){
            return true;
        }
    } catch (error) {
        console.log("not getting user role");
        return false;
    }
}

router.post('/', jwtMiddleware ,async(req,res)=>{
    try {

        
        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'User does not have authority to this service.'})
        }

        const data = req.body;
        const newCandidate = new Candidate(data);

        const response = await newCandidate.save();
        console.log('data Saved successfully');

        res.status(200).json({response:response});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }   
});


router.post('/vote/:candidateId', jwtMiddleware ,async(req,res)=>{
    try {
        
        if(await checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'You are admin, you cannot vote'})
        }

        const candidateId = req.params.candidateId;
        const userId = req.user.id;

        const candidate = await Candidate.findById(candidateId);
        if(!candidate){
            return res.status(404).json({message: 'Candidate not found'});
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        if(user.isVote){
            return res.status(400).json({message: 'you have already voted'});
        }
        
        // update candidate
        candidate.vote.push({user:userId});
        candidate.voteCount++;
        await candidate.save();

        //update user
        user.isVote= true;
        await user.save();

        res.status(200).json({message: 'vote recorded successfully'});


    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }   
});

router.get('/vote/count', async (req,res)=>{
    try {
        
        const candidate = await Candidate.find().sort({voteCount:'desc'});

        const voteRecord = candidate.map((data)=>{
            return{
                party: data.party,
                count: data.voteCount
            }
        })

        return  res.status(200).json({voteRecord}); 

    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }
})

router.put('/:candidateId', jwtMiddleware, async(req,res)=>{
    try {

        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'User does not have authority to this service.'})
        }

        const candidateId = req.params.candidateId;
            const updatedCandidate = req.body;

            const response = await Candidate.findByIdAndUpdate(candidateId,updatedCandidate,{
                new:true,
                runValidators:true
            })

            if(!response){
                res.status(404).json({error:'Candidate not found'});
            }


            console.log("candidate data updated");
            res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }
});


router.delete('/:candidateId', jwtMiddleware, async(req,res)=>{
    try {

        if(! await checkAdminRole(req.user.id)){
            return res.status(403).json({message: 'User does not have authority to this service.'})
        }

        const candidateId = req.params.candidateId;
            

            const response = await Candidate.findByIdAndDelete(candidateId)

            if(!response){
                res.status(404).json({error:'Candidate not found'});
            }


            console.log("Candidate deleted");
            res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'});
    }
});

export default router;
