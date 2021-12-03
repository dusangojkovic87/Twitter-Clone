import mongoose from 'mongoose';
import {Schema} from 'mongoose';

export const user = new Schema({
    name:{type:String,required:true},
    surname:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    profilePic: { type: String, default: "/images/default.png" },
    coverPhoto: { type: String },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }]

},{ timestamps: true });

const User = mongoose.model('User',user);

export default User;