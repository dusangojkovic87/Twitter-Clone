import {Request,Response} from 'express';
import Post from "../Models/Post";
import User from "../Models/User";

 export function defaultHome(req:Request,res:Response){
  return res.render('home');
}

export async function getAllTweets(req:Request,res:Response){
    let posts = await Post.find()
    .populate('postedBy','-password')
    .populate('replyTo')
    .populate('replyToUser')
    .populate('retweeter')
    .populate('originalTweet')
    .populate('postedBy','-password')
    .populate('originalTweetSender')
    .sort({createdAt:-1})
   

    return res.status(200).json({posts:posts});

}

export async function searchTwitter(req:Request,res:Response){
      let searchTerm = req.params.searchTerm;
      console.log(searchTerm)
      try {
        if(searchTerm != null || searchTerm != 'undefined' || searchTerm != ""){
          let data = await User.find({'name' : new RegExp(searchTerm, 'i')});
          return res.status(200).json(data);
        }else{
          let data = {
            empty:true
          }
          return res.status(200).json(data);
        }       
      } catch (err) {
         if(err){
           console.log(err);
         }
        
      
}

}


