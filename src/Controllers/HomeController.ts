import {Request,Response} from 'express';
import Post from "../Models/Post";


export = async (req:Request,res:Response)=>{
    let posts = await Post.find().populate('postedBy','-password').sort({createdAt:-1})
    res.render('home',{posts:posts});
}