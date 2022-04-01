import moment from "moment";
import { Post } from "./Interfaces/Post";
import { User } from "./Interfaces/User";

document.addEventListener("DOMContentLoaded", () => {
  getAllTweets();
  likeTweet();
  closeReplyModalListener();
  openReplyModalListener();
  replyPostListener();
  retweetPostListener();
  getUnreadMessageCount();
  
  
});

 function likeTweet() {

  let userId = getCookie("loggedUser");
  document.body.addEventListener("click", async (e: Event) => {
    let el = e.target as HTMLElement;
    if (el.classList.contains("like-post-icon")) {
      let postId = el.getAttribute("data-postId");
      await fetch("/post/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, postId: postId }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.liked === true) {
            if (postId) updateLikeCount(postId, res.likesCount);
            return;
          }
          if (res.liked === false) {
            if (postId) updateLikeCount(postId, res.likesCount);
            return;
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
          }
        });
    }
  });
}

 function updateLikeCount(postId: string, likeNumber: number) {
  let likeCountDOMAll = document.querySelectorAll(".like-count") as NodeList;
  likeCountDOMAll.forEach((likeCountEl: Node) => {
    let likeCountDOM = likeCountEl as HTMLElement;
    let likeId = likeCountDOM.getAttribute("data-postId");
    if (postId === likeId) {
      likeCountDOM.innerHTML = likeNumber.toString();
    }
  });
}

 async function getReplyCount(postId: string) {
  await fetch(`/post/replyCount/${postId}`)
    .then((data) => data.json())
    .then((data) => console.log("replyCount", data))
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
}

 function closeReplyModal() {
  let modalContainer = document.querySelector(
    ".reply-modal-container"
  ) as HTMLElement;
  if (modalContainer) modalContainer.style.display = "none";
  return;
}

 function closeReplyModalListener() {
  document.body.addEventListener("click", (e: Event) => {
    let el = e.target as HTMLElement;
    if (el.classList.contains("close--reply--btn")) {
      closeReplyModal();
    }
  });
}

 async function openReplyModal(postId: string, replierId: string) {
  let modalContainer = document.querySelector(
    ".reply-modal-container"
  ) as HTMLElement;
  modalContainer.style.display = "flex";
  await getTweetDataForReplyModal(postId, replierId)
    .then((data) => {
      if (data) insertReplyModalIntoDOM(data);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });

  return;
}

 function openReplyModalListener() {
  document.body.addEventListener("click", (e: Event) => {
    let el = e.target as HTMLElement;
    if (el.classList.contains("comment-post-icon")) {
      let postId = el.getAttribute("data-postId");
      let replierId = getCookie("loggedUser");
      if (postId && replierId) openReplyModal(postId, replierId);
    }
  });
}

 function insertReplyModalIntoDOM(data: any) {
  let modal = document.querySelector(".reply-modal-container") as HTMLElement;
  if (modal)
    modal.innerHTML = `
  <div class="reply-modal-wrrapper">
        <span class="close__icon close--reply--btn"></span>
        <div class="post-container margin--top--2rem" data-id=${data.post._id}>
          <div class="post-header-wrrapper">
            <div class="profile-img-wrrapper">
              <img src=${data.post.postedBy.profilePic} />
            </div>
            <p class="user__name">${data.post.postedBy.name} ${
      data.post.postedBy.surname
    }</p>
            <p class="posted__date">${moment(
              data.post.createdAt,
              "YYYYMMDD"
            ).fromNow()} </div>
          <div class="post-text-wrrapper">
            <p class="post__text" >${data.post.content}</p>
          </div>
        </div>
        <div class="reply-container">
              <div class="reply-img-wrrapper">
                   <img src=${data.replier.profilePic} />
              </div>
                 <form class="reply__form">
                    <textarea name="reply" id="reply__input" cols="30" rows="10" placeholder="Tweet your reply" style="overflow: hidden;"></textarea>
                    <button data-userId=${data.post.postedBy._id} data-postId=${
      data.post._id
    } data-replierId=${
      data.replier._id
    } type="submit" class="reply__btn">Reply</button>
                 </form>
             </div>
      </div>

  `;

  return;
}

 async function getTweetDataForReplyModal(postId: string, replierId: string) {
  return await fetch(`/post/replyModal/${postId}/${replierId}`).then((data) =>
    data.json()
  );
}

 function replyPostListener() {
  let replyModalContainer = document.querySelector(
    ".reply-modal-container"
  ) as HTMLElement;
  if (replyModalContainer) {
    replyModalContainer.addEventListener("click", (e: Event) => {
      e.preventDefault();
      let el = e.target as HTMLElement;
      if (el.classList.contains("reply__btn")) {
        let postId = el.getAttribute("data-postId");
        let userId = el.getAttribute("data-userId");
        let replierId = el.getAttribute("data-replierId");
        let replyContent = document.querySelector(
          "#reply__input"
        ) as HTMLTextAreaElement;
        if (userId && postId && replierId && replyContent) {
          postReplyTweet(userId, postId, replierId, replyContent.value);
        }
      }
    });
  }
}

 function postReplyTweet(
  userId: string,
  postId: string,
  replierId: string,
  data: any
) {
  if (userId && postId && replierId && data) {
    fetch(`/post/replyFromModal/${userId}/${postId}/${replierId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: data }),
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.success === true) {
          redirectToHome();
          return;
        }

        if (data.success === false) {
          redirectToHome();
          return;
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  }
}

 function redirectToHome() {
  return (window.location.href = "/");
}

 function retweetPostListener() {
  let postsContainer = document.querySelector(
    ".posts-container"
  ) as HTMLElement;

  if (postsContainer) {
    postsContainer.addEventListener("click", (e: Event) => {
      let el = e.target as HTMLElement;
      if (el.classList.contains("loop-post-icon")) {
        let postId = el.getAttribute("data-postId");
        let userId = el.getAttribute("data-userId");
        let retweeterId = getCookie("loggedUser");

        if (postId && userId && retweeterId) {
          postRetweet(postId, userId, retweeterId);
        }
      }
    });
  }
}

 function postRetweet(postId: string, userId: string, retweeterId: string) {
  fetch(`/post/retweet/${postId}/${userId}/${retweeterId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((data) => data.json())
    .then((data) => {
      let { postId } = data;
      let { retweet } = data;

      switch (retweet) {
        case true:
          console.log("inc", postId);
          incrementRetweetCount(postId);
          break;
        case false:
          console.log("dec", postId);
          decrementRetweetCount(postId);
          break;
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
}

 function incrementRetweetCount(postId: string) {
  let tweetCountList = document.querySelectorAll(".retweet-count") as NodeList;
  tweetCountList.forEach((tweetCount: Node) => {
    let el = tweetCount as HTMLElement;
    let postIdFromEl = el.getAttribute("data-postId");
    if (postId != null && postIdFromEl != null) {
      if (postIdFromEl === postId) {
        let currentValue = el.innerHTML;
        let numberToInc = Number(currentValue);
        ++numberToInc;
        let numberToAppend = numberToInc.toString();
        el.innerHTML = numberToAppend;
      }
    }
  });

  return;
}

 function decrementRetweetCount(postId: string) {
  let tweetCountList = document.querySelectorAll(".retweet-count") as NodeList;
  tweetCountList.forEach((tweetCount: Node) => {
    let el = tweetCount as HTMLElement;
    let postIdFromEl = el.getAttribute("data-postId");
    if (postId != null && postIdFromEl != null) {
      if (postIdFromEl === postId) {
        let currentValue = el.innerHTML;
        let numberToInc = Number(currentValue);
        --numberToInc;
        let numberToAppend = numberToInc.toString();
        el.innerHTML = numberToAppend;
      }
    }
  });

  return;
}

 function getCookie(cookiename: string) {
  // Get name followed by anything except a semicolon
  var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
  );
}

//get tweets functions
 function getAllTweets() {
  fetch("/home", {
    method: "GET",
  })
    .then((data) => data.json())
    .then((data) => {
      addTweetsToDOM(data);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });

  return;
}

 function addTweetsToDOM(data: any) {
  let userId = getCookie("loggedUser");
  let { posts } = data;
  if (posts.length > 0) {
    for (let index = 0; index < posts.length; index++) {
      if (
        posts[index].isRetweet == true &&
        userId != posts[index].postedBy._id &&
        posts[index].originalTweetSender._id != userId
      ) {
        addRetweet(posts[index]);
      }

      if (
        posts[index].postedBy &&
        posts[index].isRetweet == false &&
        userId != posts[index].postedBy._id
      ) {
        addOriginalTweet(posts[index]);
      }
    }
  }
}

 function addOriginalTweet(data: Post) {
  let postsContainer = document.querySelector(
    ".posts-container"
  ) as HTMLElement;
  let originalTweet = `
  <div class="post-container" data-id=${data?._id}>
  <div class="post-header-wrrapper">
    <div class="profile-img-wrrapper">
      <img src=${data.postedBy.profilePic}  />
    </div>
    <a href='/profile/details/${data.postedBy?._id}'>
    <p class="user__name">${data.postedBy?.name} ${data.postedBy?.surname}</p>
    </a>
    <p class="posted__date">${moment(data?.createdAt).fromNow()}</p>
  </div>
  ${isReplyPost(data)}
  <div class="post-text-wrrapper">
    <p class="post__text" >${data?.content}</p>
  </div>
  <div class="post-interaction-wrrapper">
    <div class="post-icon-wrrapper">
          <span class="comment-post-icon" data-postId=${data?._id}></span>
          <span class="comment-count" data-postId=${data?._id}>${
    data?.replyCount
  }</span>
    </div>
    <div class="post-icon-wrrapper">
        <span class="loop-post-icon" data-userId=${
          data.postedBy?._id
        } data-postId=${data?._id} ></span>
        <span class="retweet-count" data-postId=${data?._id}>${
    data?.retweeterList?.length
  }</span>
    </div>
    <div class="post-icon-wrrapper">
      <span class="like-post-icon" data-postId=${data._id}></span>
      <span class="like-count" data-postId=${data._id}> ${
    data.likes?.length
  } </span>
    </div>
    <div class="post-icon-wrrapper">
        <span class="upload-post-icon"></span>
    </div>
  </div>
</div>
  `;

  postsContainer.innerHTML += originalTweet;
}

 function isReplyPost(reply: Post) {
  if (reply.replyToUser != null || reply.replyToUser != undefined) {
    return `<p>replying to </p><a href="#">${reply.replyToUser.name} ${reply.replyToUser.surname}</a>`;
  }
  return "";
}

 function addRetweet(data: Post) {
  let postsContainer = document.querySelector(
    ".posts-container"
  ) as HTMLElement;
  let retweet = `
  <div class="retweet-wrrapper" data-postId=${data._id} >
          <div class="post-header-wrrapper">
             <div class="profile-img-wrrapper">
                 <img src=${data.postedBy.profilePic} alt=${
    data.postedBy.profilePic
  }>
             </div>
  <a href='/profile/details/${data.postedBy._id}'>
                 <p class="user__name">${data.retweeter.name} ${
    data.retweeter.surname
  }</p>
  </a>
                 <p class="posted__date">${moment(data.createdAt).fromNow()}</p>
           </div>
      
      <div class="original-tweet-wrrapper">
           ${addNestedRetweet(data)}
      </div>
      <div class="post-interaction-wrrapper">
    <div class="post-icon-wrrapper">
          <span class="comment-post-icon" data-postId=${data._id}></span>
          <span class="comment-count" data-postId=${data._id}>${
    data.replyCount
  }</span>
    </div>
    <div class="post-icon-wrrapper">
        <span class="loop-post-icon" data-userId=${
          data.originalTweetSender._id
        } data-postId=${data.originalTweet._id} ></span>
        <span class="retweet-count" data-postId=${data.originalTweet._id}>${
    data.originalTweet.retweeterList.length
  }</span>
    </div>
    <div class="post-icon-wrrapper">
      <span class="like-post-icon" data-postId=${data._id}></span>
      <span class="like-count" data-postId=${data._id}> ${
    data.retweeterList.length
  } </span>
    </div>
    <div class="post-icon-wrrapper">
        <span class="upload-post-icon"></span>
    </div>
  </div>
  </div>
      
  `;

  postsContainer.innerHTML += retweet;
}

 function addNestedRetweet(data: Post) {
  let nestedTweet = `
  <div class="post-container" data-id=${data._id}>
  <div class="post-header-wrrapper">
    <div class="profile-img-wrrapper">
      <img src=${data.originalTweetSender.profilePic}  />
    </div>
    <a href='/profile/details/${data.originalTweetSender._id}'>
    <p class="user__name">${data.originalTweetSender.name} ${
    data.originalTweetSender.surname
  }</p>
  </a>
    <p class="posted__date">${moment(
      data.originalTweet.createdAt
    ).fromNow()}</p>
  </div>
  ${isReplyPost(data)}
  <div class="post-text-wrrapper">
    <p class="post__text" >${data.originalTweet.content}</p>
  </div>
</div>
  `;

  return nestedTweet;
}

function getUnreadMessageCount(){
  let userId = getCookie("loggedUser");
  if(userId){
  fetch(`/messages/unreadCount/${userId}`)
  .then((data) =>{
    return data.json();

  })
  .then((data) =>{
    if(data.unreadCount > 0){
      let messageNotificationCounter = document.querySelector(".notification__message__counter") as HTMLElement;
      messageNotificationCounter.style.display = "flex";
      messageNotificationCounter.innerHTML = data.unreadCount.toString();
    } 
    if(data.unreadCount === 0){
      let messageNotificationCounter = document.querySelector(".notification__message__counter") as HTMLElement;
      messageNotificationCounter.style.display = "none";

    }


  })
  .catch((err) =>{
    if(err){
      console.log(err);
    }
  })

  }
  
}







