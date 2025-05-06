import mongoose from "mongoose";

mongoose.set('strictQuery', true);

export const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongodb connected : ', conn.connection.host);
    } catch (err) {
        console.log('Error connecting to mongodb : ', err);
    }
}