import { User } from "./User";

export interface Post{
    _id:string;
    likes:string[],
    retweeterList:string[],
    isRetweet:boolean,
    retweeter:User,
    originalTweetSender:User,
    originalTweet:Post,
    replyTo:User,
    replyToUser:User,
    replyCount:number,
    content:string,
    postedBy:User,
    createdAt:string
}