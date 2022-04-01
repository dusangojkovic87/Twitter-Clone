"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
document.addEventListener("DOMContentLoaded", (e) => {
    partialNavigationListener();
    redirectToHomePageListener();
    followUserListener();
});
function partialNavigationListener() {
    let tweetMenuNavList = document.querySelectorAll(".tweet__menu__nav");
    tweetMenuNavList.forEach((tweetNav) => {
        let nav = tweetNav;
        nav.addEventListener("click", (e) => {
            let el = e.target;
            if (el.href.indexOf("#tweets") > -1) {
                applyActiveBorderBottom(0);
                getDetailsPageTweets();
            }
            else if (el.href.indexOf("#replies") > -1) {
                applyActiveBorderBottom(1);
                clearTweetPartialLoad();
                getTweetsWithRepliesDetailsPage();
            }
            else if (el.href.indexOf("#media") > -1) {
                clearTweetPartialLoad();
                applyActiveBorderBottom(2);
                console.log("media");
            }
            else if (el.href.indexOf("#likes") > -1) {
                clearTweetPartialLoad();
                applyActiveBorderBottom(3);
                getLikesDetailsPage();
            }
        });
    });
}
function applyActiveBorderBottom(linkNumber) {
    let tweetMenuNav = document.querySelectorAll(".tweet__menu__nav");
    let link = tweetMenuNav[linkNumber];
    for (let i = 0; i <= 3; i++) {
        let t = tweetMenuNav[i];
        t.classList.remove("activeTweetMenu");
    }
    link.classList.add("activeTweetMenu");
}
function getUserIdFromUrl() {
    let id = window.location.pathname.split("/profile/details/")[1];
    return id;
}
function getDetailsPageTweets() {
    let userId = getUserIdFromUrl();
    if (userId) {
        fetch(`/profile/details/tweets/${userId}`)
            .then((data) => data.json())
            .then((data) => {
            if (data) {
                insertTweetsIntoDOM(data);
            }
        });
    }
}
function getTweetsWithRepliesDetailsPage() {
    let userId = getUserIdFromUrl();
    if (userId) {
        fetch(`/profile/details/replies/${userId}`)
            .then((data) => {
            return data.json();
        })
            .then((data) => {
            if (data) {
                insertTweetsIntoDOM(data);
            }
        });
    }
}
function getLikesDetailsPage() {
    let userId = getUserIdFromUrl();
    if (userId) {
        fetch(`/profile/details/likes/${userId}`)
            .then((data) => {
            return data.json();
        })
            .then((data) => {
            if (data) {
                insertTweetsIntoDOM(data);
            }
        });
    }
}
function insertTweetsIntoDOM(data) {
    data.forEach((post) => {
        if (post.isRetweet === true) {
            addRetweetToProfile(post);
        }
        else {
            addOriginalTweetToProfile(post);
        }
    });
}
function addRetweetToProfile(data) {
    let postsContainer = document.querySelector(".profile-tweet-content");
    let retweet = `
    <div class="post-container" data-id=${data._id} >
            <div class="post-header-wrrapper">
               <div class="profile-img-wrrapper">
                   <img src=${data.postedBy.profilePic} alt=${data.postedBy.profilePic}>
               </div>
                   <p class="user__name">${data.retweeter.name} ${data.retweeter.surname}</p>
                   <p class="posted__date">${(0, moment_1.default)(data.createdAt).fromNow()}</p>
             </div>
        
        <div class="original-tweet-wrrapper">
             ${addNestedRetweetToProfile(data)}
        </div>
    </div>
        
    `;
    postsContainer.innerHTML += retweet;
}
function addNestedRetweetToProfile(data) {
    let nestedTweet = `
    <div class="post-container" data-id=${data._id}>
    <div class="post-header-wrrapper">
      <div class="profile-img-wrrapper">
        <img src=${data.originalTweetSender.profilePic}  />
      </div>
      <p class="user__name">${data.originalTweetSender.name} ${data.originalTweetSender.surname}</p>
      <p class="posted__date">${(0, moment_1.default)(data.originalTweet.createdAt).fromNow()}</p>
    </div>
    ${isReplyPost(data)}
    <div class="post-text-wrrapper">
      <p class="post__text" >${data.originalTweet.content}</p>
    </div>
  </div>
    `;
    return nestedTweet;
}
function addOriginalTweetToProfile(data) {
    var _a;
    let postsContainer = document.querySelector(".profile-tweet-content");
    let originalTweet = `
    <div class="post-container" data-id=${data._id}>
    <div class="post-header-wrrapper">
      <div class="profile-img-wrrapper">
        <img src=${data.postedBy.profilePic}  />
      </div>
      <p class="user__name">${data.postedBy.name} ${data.postedBy.surname}</p>
      <p class="posted__date">${(0, moment_1.default)(data.createdAt).fromNow()}</p>
    </div>
    ${isReplyPost(data)}
    <div class="post-text-wrrapper">
      <p class="post__text" >${data.content}</p>
    </div>
    <div class="post-interaction-wrrapper">
      <div class="post-icon-wrrapper">
            <span class="comment-post-icon" data-postId=${data._id}></span>
            <span class="comment-count" data-postId=${data._id}>${data.replyCount}</span>
      </div>
      <div class="post-icon-wrrapper">
          <span class="loop-post-icon" data-userId=${data.postedBy._id} data-postId=${data._id} ></span>
          <span class="retweet-count" data-postId=${data._id}>${data.retweeterList.length}</span>
      </div>
      <div class="post-icon-wrrapper">
        <span class="like-post-icon" data-postId=${data._id}></span>
        <span class="like-count" data-postId=${data._id}> ${(_a = data.likes) === null || _a === void 0 ? void 0 : _a.length} </span>
      </div>
      <div class="post-icon-wrrapper">
          <span class="upload-post-icon"></span>
      </div>
    </div>
  </div>
    `;
    postsContainer.innerHTML += originalTweet;
}
function isReplyPost(reply) {
    if (reply.replyToUser != null || reply.replyToUser != undefined) {
        return `<p>replying to </p><a href="#">${reply.replyToUser.name} ${reply.replyToUser.surname}</a>`;
    }
    return "";
}
function clearTweetPartialLoad() {
    let tweetContent = document.querySelector(".profile-tweet-content");
    tweetContent.innerHTML = "";
}
function redirectToHomePageListener() {
    let backBtn = document.querySelector(".back__icon");
    backBtn.addEventListener("click", (e) => {
        window.location.href = "/";
        return;
    });
}
function followUserListener() {
    let folowBtn = document.querySelector(".follow__btn");
    if (folowBtn) {
        folowBtn.addEventListener("click", (e) => {
            let userId = getUserIdFromUrl();
            if (userId && folowBtn) {
                followUser(userId, folowBtn);
            }
        });
    }
}
function followUser(userId, followBtn) {
    fetch(`/profile/details/follow/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    })
        .then((data) => {
        return data.json();
    })
        .then((data) => {
        if (data.unfollow === true) {
            if (followBtn)
                followBtn.innerText = "Follow";
            followBtn.setAttribute("style", "color:white !important");
            let btnWrrapper = followBtn.parentElement;
            if (btnWrrapper) {
                btnWrrapper.setAttribute("style", "background-color:black !important");
            }
        }
        if (data.follow === true) {
            if (followBtn) {
                followBtn.innerText = "Following";
                let btnWrrapper = followBtn.parentElement;
                if (btnWrrapper) {
                    btnWrrapper.setAttribute("style", "background-color:#E1E8ED !important");
                    followBtn.setAttribute("style", "color:black !important");
                }
            }
        }
    })
        .catch((err) => {
        if (err) {
            console.log(err);
        }
    });
}
//# sourceMappingURL=detailsPage.js.map