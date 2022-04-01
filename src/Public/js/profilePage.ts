import { Post } from "./Interfaces/Post";
import moment from "moment";

let tweetMenuNav = document.querySelectorAll(".tweet__menu__nav") as NodeList;
let tweetContent = document.querySelector(
  ".profile-tweet-content"
) as HTMLElement;

document.addEventListener("DOMContentLoaded", () => {
  redirectToHomePageListener();

  /* open and close edit profile modal*/
  openAndCloseEditProfileModalListener();

  /*opens add bg image modal*/
  openCloseBackgroundImageModalListener();

  /* Bg Input image change */
  backgroundProfileImagePreviewListener();

  /*profile image modal open*/
  openCloseProfileImageModalListener();

  /*Profile image change preview */
  profileImagePreviewListener();

  /*edit user info post handling*/
  postEditProfileDataListener();

  /*default load of partial*/
  loadPartialPageBasedOnUrl();

  /*profile partial navigation*/
  partialProfileNavigationListener();

  /*open delete tweet modal */
  openDeleteTweetModalListener();

  /*cancel delete tweet modal modal */
  cancelDeleteTweetModalListener();
  deleteTweetListener();

  //like,unlike tweet listener
  likeTweet();

  //reply modal
  openReplyModalListener();
  replyPostListener();
  closeReplyModalListener();
  //retweet
  retweetPostListener();



});

 function loadPartialPageBasedOnUrl() {
  if (window.location.href.indexOf("#tweets") > -1) {
    tweetContent.innerHTML = "";
    applyActiveBorderBottom(0);
    loadTweets();
  } else if (window.location.href.indexOf("#replies") > -1) {
    getTweetsWithReplies();
    applyActiveBorderBottom(1);
    tweetContent.innerHTML = "";
  } else if (window.location.href.indexOf("#media") > -1) {
    applyActiveBorderBottom(2);
    tweetContent.innerHTML = "";
    tweetContent.innerHTML = "<h1>Media</h1>";
  } else if (window.location.href.indexOf("#likes") > -1) {
    tweetContent.innerHTML = "";
    getMyLikes();
    applyActiveBorderBottom(3);
  }
}
 function applyActiveBorderBottom(linkNumber: number) {
  let link = tweetMenuNav[linkNumber] as HTMLAnchorElement;

  for (let i = 0; i <= 3; i++) {
    let t = tweetMenuNav[i] as HTMLAnchorElement;
    t.classList.remove("activeTweetMenu");
  }

  link.classList.add("activeTweetMenu");
}

export function loadTweets() {
  fetch("/profile/myTweets")
    .then((data) => data.json())
    .then((data) => {
      if (data.length === 0) {
        showEmptyProfileData("tweets");
        return;
      }
      tweetContent.innerHTML = "";
      insertTweetsIntoDOM(data);
    })
    .catch((err) => console.log(err));
}

 function getTweetsWithReplies() {
  fetch("/profile/replies")
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        showEmptyProfileData("replies");
      }
      insertTweetsIntoDOM(data);
    })
    .catch((err) => console.log(err));
}

 function getMyLikes() {
  fetch("/profile/likes")
    .then((data:any) => data.json())
    .then((data:any) => {
      if (data.length === 0) {
        showEmptyProfileData("likes");
        return;
      }
      insertTweetsIntoDOM(data);
    });
}

 function insertTweetsIntoDOM(data: any) {
  data.forEach((post: Post) => {
    if (post.isRetweet === true) {
      addRetweetToProfile(post);
    }else{
      addOriginalTweetToProfile(post);
    }
  });

}

 function showEmptyProfileData(profileDataName: string) {
  if (tweetContent)
    tweetContent.innerHTML = `<h1 class='empty__profile__text' > No ${profileDataName} </h1>`;
}

 function redirectToHomePageListener() {
  let backBtn = document.querySelector(".back__icon") as HTMLElement;
  backBtn.addEventListener("click", (e: Event) => {
    window.location.href = "/";
    return;
  });
}

 function partialProfileNavigationListener() {
  defaultPartialLoad();
  tweetMenuNav.forEach((tweetLink: Node) => {
    let tweetLinkHTML = tweetLink as HTMLAnchorElement;
    tweetLinkHTML.addEventListener("click", (e: Event) => {
      e.preventDefault();
      let anc = e.target as HTMLAnchorElement;
      if (anc.href.match("tweets")) {
        window.location.href = "profile#tweets";
        loadPartialPageBasedOnUrl();
      } else if (anc.href.match("replies")) {
        window.location.href = "profile#replies";
        loadPartialPageBasedOnUrl();
      } else if (anc.href.match("media")) {
        window.location.href = "profile#media";
        loadPartialPageBasedOnUrl();
      } else if (anc.href.match("likes")) {
        window.location.href = "profile#likes";
        loadPartialPageBasedOnUrl();
      }
    });
  });
}

 function postEditProfileDataListener() {
  let userNameInfo = document.querySelector(
    ".user__name__info"
  ) as HTMLInputElement;
  let userSurnameInfo = document.querySelector(
    ".user__surname__info"
  ) as HTMLInputElement;
  let userBioInfo = document.querySelector(
    ".user__bio__info"
  ) as HTMLInputElement;
  let userLocationInfo = document.querySelector(
    ".user__location__info"
  ) as HTMLInputElement;
  let userBirthdateInfo = document.querySelector(
    ".user__birthdate__info"
  ) as HTMLInputElement;
  let saveEditBtn = document.querySelector(
    ".save__edit__btn"
  ) as HTMLButtonElement;

  saveEditBtn.addEventListener("click", () => {
    let formData = {
      name: userNameInfo.value,
      surname: userSurnameInfo.value,
      bio: userBioInfo.value,
      location: userLocationInfo.value,
      birthdate: userBirthdateInfo.value,
    };

    fetch("/profile/editProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: formData }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success === true) {
          window.location.reload();
          return;
        }

        if (res.success == false) {
          /*replace with sweet alert*/
          alert("field name,surname cannot be empty!");
          return;
        }
      })
      .catch((err) => console.log(err));
  });
}

 function profileImagePreviewListener() {
  let profileImageInput = document.querySelector(
    "#profileImageInput"
  ) as HTMLElement;

  profileImageInput.addEventListener("change", (e: Event) => {
    let imageFile = e.target as HTMLInputElement;
    if (!imageFile.files) {
      return;
    }

    /* preview profile img*/
    let preview = document.querySelector(
      ".profile__preview"
    ) as HTMLImageElement;
    preview.src = URL.createObjectURL(imageFile.files[0]);
    preview.onload = () => {
      URL.revokeObjectURL(preview.src);
    };
  });
}

 function backgroundProfileImagePreviewListener() {
  let bgImageInput = document.querySelector("#bgImgInput") as HTMLInputElement;
  bgImageInput.addEventListener("change", (e: Event) => {
    let imageFile = e.target as HTMLInputElement;
    if (!imageFile.files) {
      return;
    }

    /* preview bg img*/
    let preview = document.querySelector(".bg__preview") as HTMLImageElement;
    preview.src = URL.createObjectURL(imageFile.files[0]);
    preview.onload = () => {
      URL.revokeObjectURL(preview.src);
    };
  });
}

 function openCloseProfileImageModalListener() {
  let profileImageModalBtn = document.querySelector(
    ".add--main--img"
  ) as HTMLElement;
  let profileImageModal = document.querySelector(
    ".upload-profile-img-modal"
  ) as HTMLElement;
  let closeAddProfileModal = document.querySelector(
    ".close__add__profile"
  ) as HTMLElement;

  profileImageModal.style.display = "none";
  profileImageModalBtn.addEventListener("click", () => {
    profileImageModal.style.display = "flex";
  });

  /*close profile modal*/
  closeAddProfileModal.addEventListener("click", () => {
    profileImageModal.style.display = "none";
  });
}

 function openCloseBackgroundImageModalListener() {
  let addBgImageModal = document.querySelector(
    ".upload-bg-img-modal"
  ) as HTMLElement;
  let addBgImageBtn = document.querySelector(".add--bg--image") as HTMLElement;
  let closeAddBgModal = document.querySelector(
    ".close__add__bg"
  ) as HTMLElement;

  if (addBgImageBtn) {
    addBgImageBtn.addEventListener("click", (e: Event) => {
      addBgImageModal.style.display = "flex";
    });
  }

  /* closes add bg modal */
  if (closeAddBgModal) {
    closeAddBgModal.addEventListener("click", (e: Event) => {
      e.stopPropagation();
      addBgImageModal.style.display = "none";
    });
  }
}

 function openAndCloseEditProfileModalListener() {
  let editProfileBtn = document.querySelector(
    ".edit__profile__btn"
  ) as HTMLButtonElement;
  let editProfileModal = document.querySelector(
    ".edit-profile-modal-container"
  ) as HTMLElement;
  let closeModalBtn = document.querySelector(
    ".close__edit__modal"
  ) as HTMLElement;

  let addBgImageModal = document.querySelector(
    ".upload-bg-img-modal"
  ) as HTMLElement;

  editProfileModal.style.display = "none";
  addBgImageModal.style.display = "none";

  editProfileBtn.addEventListener("click", (e: Event) => {
    editProfileModal.style.display = "flex";
    /*close modal if clicked outside modal */
    if (editProfileModal) {
      editProfileModal.addEventListener("click", (e: Event) => {
        let modal = e.target as HTMLElement;
        if (modal.classList.contains("edit-profile-modal-container")) {
          modal.style.display = "none";
        }
      });
    }

    /* close modal button*/
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", (e: Event) => {
        editProfileModal.style.display = "none";
      });
    }
  });
}

 function defaultPartialLoad() {
  window.location.href = "profile#tweets";
  loadPartialPageBasedOnUrl();
}

 function openDeleteTweetModalListener() {
  let tweetContent = document.querySelector(
    ".profile-tweet-content"
  ) as HTMLElement;
  tweetContent.addEventListener("click", (e: Event) => {
    let currentEl = e.target as HTMLElement;
    if (currentEl.classList.contains("dots-icon")) {
      let modal = currentEl.previousElementSibling;
      if (modal) {
        modal.classList.toggle("open--delete--modal");
      }
    }
  });
}

 function cancelDeleteTweetModalListener() {
  let tweetContent = document.querySelector(
    ".profile-tweet-content"
  ) as HTMLElement;
  tweetContent.addEventListener("click", (e: Event) => {
    let currentEl = e.target as HTMLElement;
    if (currentEl.classList.contains("cancel__delete__tweet")) {
      let modal = currentEl.parentElement;
      if (modal) {
        modal.classList.toggle("open--delete--modal");
      }
    }
  });
}

 function deleteTweetListener() {
  let tweetContent = document.querySelector(
    ".profile-tweet-content"
  ) as HTMLElement;
  tweetContent.addEventListener("click", (e: Event) => {
    let curentEl = e.target as HTMLElement;
    if (curentEl.classList.contains("delete__tweet__btn")) {
      let modal = curentEl.parentElement?.parentElement?.parentElement;
      if (modal) {
        let postId = modal.getAttribute("data-id");
        let userId = getCookie("loggedUser");
        if (postId && userId) {
          deleteTweet(postId, userId);
        }
      }
    }
  });
}

 function deleteTweet(postId: string, userId: string) {
  fetch(`/post/remove/${postId}/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      if (data.deleted === true) {
        removeTweetFromDOMById(data.postId);
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
}

 function getCookie(cookiename: string) {
  // Get name followed by anything except a semicolon
  var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
  );
}

 function removeTweetFromDOMById(postId: string) {
  let postContainers = document.querySelectorAll(".post-container") as NodeList;
  postContainers.forEach((postContainer: Node) => {
    let currentPost = postContainer as HTMLElement;
    let postIdFromEl = currentPost.getAttribute("data-id");
    if (postIdFromEl === postId) {
      currentPost.remove();
    }
  });

  return;
}

 function isReplyPost(reply: Post) {
  if (reply.replyToUser != null || reply.replyToUser != undefined) {
    return `<p>replying to </p><a href="#">${reply.replyToUser.name} ${reply.replyToUser.surname}</a>`;
  }
  return "";
}

 function addRetweetToProfile(data: Post) {
  let postsContainer = document.querySelector(
    ".profile-tweet-content"
  ) as HTMLElement;
  let retweet = `
  <div class="post-container" data-id=${data._id} >
  <div class="delete-post-wrrapper"> 
  <div class="delete-tweet-modal">
      <button class="delete__tweet__btn">Delete tweet</button>
      <button class="cancel__delete__tweet">Cancel</button>
  </div>
      <span class="dots-icon"> </span> 
</div>
          <div class="post-header-wrrapper">
             <div class="profile-img-wrrapper">
                 <img src=${data.postedBy.profilePic} alt=${
    data.postedBy.profilePic
  }>
             </div>
                 <p class="user__name">${data.retweeter.name} ${
    data.retweeter.surname
  }</p>
 
                 <p class="posted__date">${moment(data.createdAt).fromNow()}</p>
           </div>
      
      <div class="original-tweet-wrrapper">
           ${addNestedRetweetToProfile(data)}
      </div>
  </div>
      
  `;

  postsContainer.innerHTML += retweet;
}

 function addNestedRetweetToProfile(data: Post) {
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
    <p class="posted__date">${moment(data.originalTweet.createdAt).fromNow()}</p>
  </div>
  ${isReplyPost(data)}
  <div class="post-text-wrrapper">
    <p class="post__text" >${data.originalTweet.content}</p>
  </div>
</div>
  `;

  return nestedTweet;
}

 function addOriginalTweetToProfile(data: Post) {
  let postsContainer = document.querySelector(
    ".profile-tweet-content"
  ) as HTMLElement;
  let originalTweet = `
  <div class="post-container" data-id=${data._id}>
  <div class="delete-post-wrrapper"> 
  <div class="delete-tweet-modal">
      <button class="delete__tweet__btn">Delete tweet</button>
      <button class="cancel__delete__tweet">Cancel</button>
  </div>
      <span class="dots-icon"> </span> 
</div>
  <div class="post-header-wrrapper">
    <div class="profile-img-wrrapper">
      <img src=${data.postedBy.profilePic}  />
    </div>
    <p class="user__name">${data.postedBy.name} ${data.postedBy.surname}</p>
    <p class="posted__date">${moment(data.createdAt).fromNow()}</p>
  </div>
  ${isReplyPost(data)}
  <div class="post-text-wrrapper">
    <p class="post__text" >${data.content}</p>
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
          data.postedBy._id
        } data-postId=${data._id} ></span>
        <span class="retweet-count" data-postId=${data._id}>${
    data.retweeterList.length
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
            if(postId)
               removeTweetFromDOMById(postId);
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

//reply modal
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

 async function getTweetDataForReplyModal(postId: string, replierId: string) {
  return await fetch(`/post/replyModal/${postId}/${replierId}`).then((data) =>
    data.json()
  );
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

//retweet
 function retweetPostListener() {
  let postsContainer = document.querySelector(
    ".profile-tweet-content"
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
      let {postToDeleteId} = data;
    

      switch (retweet) {
        case true:
          console.log("inc", postId);
          incrementRetweetCount(postId);
          break;
        case false:
          console.log("dec", postId);
          decrementRetweetCount(postId);
          removeTweetFromDOMById(postToDeleteId);
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







