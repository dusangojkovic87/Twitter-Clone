import { Request, Response } from "express";
import validator from "validator";
import Post from "../Models/Post";

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


export async function getPostById(req:Request,res:Response){
  let post = await Post.findOne({_id: req.params.id});
  res.render('post',{post:post});

}




