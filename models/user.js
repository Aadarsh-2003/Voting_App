import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type: Number,
        required:true
    },
    email:{
        type: String,

    },
    mobile:{
        type: String,

    },
    address:{
        type: String,
        required:true

    },
    aadharCardNum:{
        type: Number,
        required:true,
        unique:true

    },
    password:{
        type:String,
        required:true

    },
    role:{
        type: String,
        enum: ['voter', 'admin'],
        default:'voter'
    },
    isVote:{
        type:Boolean,
        default:false
    }
})

userSchema.pre('save', async function(next){
    const user = this;

    if(!user.isModified('password')){
        return next();
    }
    try {

        const salt = await bcrypt.genSalt(10);

        const hashedPass = await bcrypt.hash(user.password , salt);
        user.password = hashedPass;
        

        next();
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword){
    try {
        const isMatch = await bcrypt.compare(candidatePassword , this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }

}

const User = mongoose.model('User',userSchema);
export default User;