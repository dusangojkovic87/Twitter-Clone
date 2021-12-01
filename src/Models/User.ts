import mongoose from 'mongoose';
import {Schema} from 'mongoose';

export const user = new Schema({
    name:{type:String,required:true},
    surname:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},

});

const User = mongoose.model('User',user);

export default User;