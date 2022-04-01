import mongoose from "mongoose";
import { Schema } from "mongoose";

export const post = new Schema(
  {
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    originalTweet:{type:Schema.Types.ObjectId, ref: "Post"},
    originalTweetSender:{type:Schema.Types.ObjectId,ref:'User'},
    retweeter:{type:Schema.Types.ObjectId,ref:'User'},
    retweeterList:[{type:Schema.Types.ObjectId,ref:'User'}],
    isRetweet:{type:Boolean,default:false},
    replyTo: { type: Schema.Types.ObjectId, ref: "Post" },
    replyToUser: { type: Schema.Types.ObjectId, ref: "User" },
    replyCount:{type:Number,default:0}
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", post);

export default Post;
