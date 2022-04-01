import mongoose from 'mongoose';
import {Schema} from 'mongoose';

export const user = new Schema({
    name:{type:String,required:true},
    surname:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    bio:{type:String,required:false},
    location:{type:String,required:false},
    birthdate:{type:Date,required:false},
    profilePic: { type: String, default: "/images/default.png" },
    bgImage:{ type: String, default: "/images/bgdefault.jpg" },
    coverPhoto: { type: String },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
   /*  retweets:[{type:Schema.Types.ObjectId,ref:'Post'}] */
    

},{ timestamps: true });

const User = mongoose.model('User',user);

export default User;