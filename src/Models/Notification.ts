import mongoose from "mongoose";
import { Schema } from "mongoose";

export const notification = new Schema(
    {
        sender:{type:Schema.Types.ObjectId,ref:'User'},
        reciver:{type:Schema.Types.ObjectId,ref:'User'},
        content:{type:String},
        isRead:{type:Boolean,default:false},
        type:{type:String}
    }
  );
  
  const Notification = mongoose.model("Notification", notification);
  
  export default Notification;
  