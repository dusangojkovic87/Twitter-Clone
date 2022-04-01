import { Request, Response } from "express";
import validator from "validator";
import Post from "../Models/Post";
import User from "../Models/User";

//logged user data
export async function getUserProfile(req: Request, res: Response) {
  let user = await User.findOne({ _id: req.session.userId });
  let tweetCount = await Post.find({ postedBy: req.session.userId });
  return res.render("profile", { user: user, tweetCount: tweetCount.length });
}

export async function postBackgroundImage(req: Request, res: Response) {
  const originalName = req.file?.originalname;
  const pathToFile = `/uploads/background/${originalName}`;
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.session.userId },
      { bgImage: pathToFile },
      { useFindAndModify: false }
    );
    return res.redirect("/profile");
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }

  return;
}

export async function postProfileImage(req: Request, res: Response) {
  const originalName = req.file?.originalname;
  const pathToFile = `/uploads/profile/${originalName}`;

  try {
    let user = await User.findOneAndUpdate(
      { _id: req.session.userId },
      { profilePic: pathToFile },
      { useFindAndModify: false }
    );
    return res.redirect("/profile");
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }

  return;
}

export async function postEditProfile(req: Request, res: Response) {
  const { content } = req.body;

  if (validator.isEmpty(content.name) || validator.isEmpty(content.surname)) {
    res.status(401).json({ success: false });
    return;
  }

  const userInfoUpdate = {
    name: content.name,
    surname: content.surname,
    bio: content.bio,
    location: content.location,
    birthdate: content.birthdate,
  };
  const options = { upsert: true };

  try {
    let updateUser = await User.updateOne(
      { _id: req.session.userId },
      { $set: userInfoUpdate },
      options
    );
    if (updateUser != null) {
      res.status(200).json({ success: true });
      return;
    }
  } catch (err) {
    if (err) console.log(err);
  }

  return;
}

export async function getMyTweets(req: Request, res: Response) {
  try {
    let posts = await Post.find({ postedBy: req.session.userId })
      .where({ replyToUser: null })
      .populate("postedBy", "-password")
      .populate("originalTweet")
      .populate("originalTweetSender")
      .populate("retweeter");
    return res.status(200).json(posts);
  } catch (err) {
    if (err) console.log(err);
  }
}

export async function getTweetsWithReplies(req: Request, res: Response) {
  try {
    let replies = await Post.find({ postedBy: req.session.userId })
      .populate("postedBy", "-password")
      .populate("replyToUser", "-password")
      .populate("originalTweet")
      .populate("originalTweetSender")
      .populate("retweeter")
      .sort({ createdAt: -1 });
    res.status(200).json(replies);
  } catch (err) {
    console.log(err);
  }
}

export async function getMyLikes(req: Request, res: Response) {
  try {
    let likes = await Post.find({ likes: req.session.userId })
      .populate("postedBy", "-password")
      .populate("replyToUser", "-password")
      .populate("originalTweet")
      .populate("originalTweetSender")
      .populate("retweeter");
    res.status(200).json(likes);
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
}

//details page
export async function getDetailsPageData(req: Request, res: Response) {
  let userId = req.params.userId;
  let user = await User.findOne({ _id: userId });
  let tweetCount = await Post.find({ postedBy: userId });
  return res.render("details", { user: user, tweetCount: tweetCount.length });
}

export async function getDetailsPageTweets(req: Request, res: Response) {
  let userId = req.params.userId;
  try {
    let posts = await Post.find({ postedBy: userId })
      .where({ replyToUser: null })
      .populate("postedBy", "-password")
      .populate("originalTweet")
      .populate("originalTweetSender")
      .populate("retweeter");
    return res.status(200).json(posts);
  } catch (err) {
    if (err) console.log(err);
  }
}

export async function getTweetsWithRepliesDetailsPage(
  req: Request,
  res: Response
) {
  let userId = req.params.userId;
  try {
    let replies = await Post.find({ postedBy: userId })
      .populate("postedBy", "-password")
      .populate("replyToUser", "-password")
      .populate("originalTweet")
      .populate("originalTweetSender")
      .populate("retweeter")
      .sort({ createdAt: -1 });
    res.status(200).json(replies);
  } catch (err) {
    console.log(err);
  }
}

export async function getLikesDetailsPage(req: Request, res: Response) {
  let userId = req.params.userId;

  try {
    let likes = await Post.find({ likes: userId })
      .populate("postedBy", "-password")
      .populate("replyToUser", "-password")
      .populate("originalTweet")
      .populate("originalTweetSender")
      .populate("retweeter");
    res.status(200).json(likes);
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
}

export async function followUser(req: Request, res: Response) {
  let loggedUserId = req.session.userId;
  let userId = req.params.userId;

  if(loggedUserId != null && userId != null){
  try {
    let userToFollow = await User.findOne({ _id: userId });
    let isFollowing = userToFollow.followers.includes(loggedUserId);
    if (isFollowing) {
      await User.updateOne(
        { _id: userId },
        { $pull: { followers: loggedUserId } }
      );
      await User.updateOne(
        { _id: loggedUserId },
        { $pull: { following: userId } }
      );

      let data = {
        userId: userId,
        unfollow: true,
      };

      return res.status(200).json(data);
    }

    let updateUserToFollow = await User.updateOne(
      { _id: userId },
      { followers: loggedUserId }
    );
    let updateLoggedUser = await User.updateOne(
      { _id: loggedUserId },
      { following: userId }
    );

    let data = {
      userId: userId,
      follow: true,
    };

    return res.status(200).json(data);
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }

}
}
