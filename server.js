import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import userRoutes from './routes/userRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js'
import { jwtMiddleware } from './jwt.js';


const app = express();
app.use(express.json());
dotenv.config();

app.get('/',(req,res)=>{
    res.send("Welcome to my voting app");
});

app.use('/user',userRoutes);
app.use('/candidate', jwtMiddleware,candidateRoutes);

app.listen(process.env.PORT,()=>{
    connectDB();
    console.log('Server started at port : http://localhost:3000')
});