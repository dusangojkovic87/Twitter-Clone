import mongoose from "mongoose";
import { Schema } from "mongoose";

export const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    reciver:{type: Schema.Types.ObjectId, ref: 'User'},
    content: { type: String, trim: true },
    isRead:{type:Boolean,default:false}
}, { timestamps: true });

const Message = mongoose.model("Message",messageSchema);
export default Message;