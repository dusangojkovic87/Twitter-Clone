import mongoose from "mongoose";
import { Schema } from "mongoose";

export const post = new Schema(
  {
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    retweetData: { type: Schema.Types.ObjectId, ref: "Post" },
    replyTo: { type: Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", post);

export default Post;
