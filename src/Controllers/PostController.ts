import { Request, Response } from "express";
import validator from "validator";
import Post from "../Models/Post";
import User from "../Models/User";
import Notification from "../Models/Notification";
import getSocketIo from "../server";

export function postTweet(req: Request, res: Response) {
  const { content } = req.body;
  if (validator.isEmpty(content)) {
    res.status(400).json({ success: false });
    return;
  }

  let newPost = new Post({
    content: content,
    postedBy: req.session.userId,
  });

  newPost
    .save()
    .then(() => {
      res.status(200).json({ success: true });
      return;
    })
    .catch(() => {
      res.status(500).json({ error: "Error on server!" });
    });
}

export async function getPostById(req: Request, res: Response) {
  let post = await Post.findOne({ _id: req.params.id }).populate(
    "postedBy",
    "-password"
  );
  let replies = await Post.find({ replyTo: req.params.id })
    .populate("postedBy", "-password")
    .populate("replyTo")
    .populate("replyToUser")
    .sort({ createdAt: -1 });
  res.render("post", { post: post, replies: replies });
}

export async function replyToPost(req: Request, res: Response) {
  let postId = req.params.postId;
  let profileId = req.params.userId;
 
  let countReply = await Post.countDocuments({replyTo:postId});

  await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { replyCount: ++countReply } }
  );

  let replyPost = new Post({
    content: req.body.reply,
    replyTo: postId,
    postedBy: req.session.userId,
    replyToUser: profileId,
  });
  replyPost
    .save()
    .then(() => {
     res.redirect("/")
      return;
    })
    .catch((err) => {
     if(err){
       console.log(err);
     }
      return;
    });
}

export async function likeAPost(req: Request, res: Response) {
  let userId = req.body.userId;
  let postId = req.body.postId;
  let senderId = req.session.userId;
  try {
    let post = await Post.findOne({ _id: postId, likes: userId });
    
    if (post == null) {
      const options = { upsert: true };
      let updatedLikePost = await Post.updateOne(
        { _id: postId },
        { likes: userId },
        options
      );

      let postFromDb = await Post.findOne({ _id: postId });
      let likesCount = postFromDb.likes.length;
      let newNotification = new Notification({
        sender:senderId,
        reciver:postFromDb.postedBy,
        content:"Liked your post",
        type:"Post"

      });

      newNotification
        .save()
        .then( async (notification) =>{
         let notificationInfo = await Notification.findById(notification._id).populate("sender");
        const io = getSocketIo();
         io.emit("likedPost",{notificationInfo:notificationInfo});      
        })
        .catch((err) =>{
          if(err){
            console.log(err);
          }
        })

      let data = {
        liked: true,
        likesCount: likesCount,
      };
      return res.status(200).json(data);
    } else {
      let updatedLikePost = await Post.updateOne(
        { _id: postId },
        { $pull: { likes: userId } }
      );
      let postFromDb = await Post.findOne({ _id: postId });
      let likesCount = postFromDb.likes.length;
      let data = {
        liked: false,
        likesCount: likesCount,
      };
      return res.status(200).json(data);
    }
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
}

export async function getTweetDataForReplyModal(req: Request, res: Response) {
  try {
    let postId = req.params.postId;
    let replierId = req.params.replierId;

    let post = await Post.findOne({ _id: postId }).populate(
      "postedBy",
      "-password"
    );

    let replier = await User.findOne({ _id: replierId });
    let data = {
      post: post,
      replier: replier,
    };

    return res.status(200).json(data);
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
}

export async function replyFromModal(req: Request, res: Response){
  let userId = req.params.userId;
  let postId = req.params.postId;
  let replierId = req.params.replierId;
  
 
  let countReply = await Post.countDocuments({replyTo:postId});

  await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { replyCount: ++countReply } }
  );

  let replyPost = new Post({
    content: req.body.reply,
    replyTo: postId,
    postedBy: replierId,
    replyToUser: userId,
  });
  replyPost
    .save()
    .then(() => {
      res.status(200).json({success:true});
      return;
    })
    .catch(() => {
      res.status(400).json({success:false});
      return;
    });

}

export async function retweetPost(req: Request, res: Response){
  let userId = req.params.userId;
  let postId = req.params.postId;
  let retweeterId = req.params.retweeterId;

  let isRetweet = await Post.findOne({postedBy:retweeterId,retweeter:retweeterId});
  const options = { upsert: true };

  if(isRetweet == null){
    
    await Post.create({postedBy:retweeterId,retweeter:retweeterId,isRetweet:true,originalTweet:postId,originalTweetSender:userId});
     //update retweeter count in original tweet
      await Post.updateOne({postedBy:userId},{$push:{retweeterList:retweeterId}},options);
     
      let data = {
        retweet:true,
        postId:postId
      }
     return res.status(200).json(data);
  }

   let postToDelete = await Post.findOne({retweeter:retweeterId});
   await Post.findOneAndDelete({retweeter:retweeterId});
   //update original tweet count if untweeted
   await Post.updateOne({postedBy:userId},{$pull:{retweeterList:retweeterId}},options);
   let data = {
    retweet:false,
    postId:postId,
    postToDeleteId:postToDelete._id

  }
   return res.status(200).json(data);


}

export async function deleteTweet(req: Request, res: Response) {
        let postId = req.params.postId;
        let userId = req.params.userId;
       
       try {
        let post = await Post.findOne({_id:postId}).populate('originalTweet');
        if(post.isRetweet === true){
          let originalTweetId = post.originalTweet._id;
          let updateOriginalRetweetList = await Post.updateOne({_id:originalTweetId},{$pull:{retweeterList:userId}});
          let isDeleted = await Post.findOneAndDelete({_id:postId});
          let data = {
            deleted:true,
            postId:postId,
            userId:userId
          };
  
          return res.status(202).json(data);

        }

        if(post.isRetweet === false){
          let isDeleted = await Post.findOneAndDelete({_id:postId});
          let data = {
            deleted:true,
            postId:postId,
            userId:userId
          };

          return res.status(202).json(data);

        }
    
        
       } catch (err) {
        let data = {
          deleted:false,
          postId:postId,
          userId:userId
        };

         if(err){
           res.status(400).json(data);
         }
         
       }     
}

