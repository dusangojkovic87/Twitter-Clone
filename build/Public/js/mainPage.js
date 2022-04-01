"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
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
    document.body.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        let el = e.target;
        if (el.classList.contains("like-post-icon")) {
            let postId = el.getAttribute("data-postId");
            yield fetch("/post/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userId, postId: postId }),
            })
                .then((res) => res.json())
                .then((res) => {
                if (res.liked === true) {
                    if (postId)
                        updateLikeCount(postId, res.likesCount);
                    return;
                }
                if (res.liked === false) {
                    if (postId)
                        updateLikeCount(postId, res.likesCount);
                    return;
                }
            })
                .catch((err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }));
}
function updateLikeCount(postId, likeNumber) {
    let likeCountDOMAll = document.querySelectorAll(".like-count");
    likeCountDOMAll.forEach((likeCountEl) => {
        let likeCountDOM = likeCountEl;
        let likeId = likeCountDOM.getAttribute("data-postId");
        if (postId === likeId) {
            likeCountDOM.innerHTML = likeNumber.toString();
        }
    });
}
function getReplyCount(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`/post/replyCount/${postId}`)
            .then((data) => data.json())
            .then((data) => console.log("replyCount", data))
            .catch((err) => {
            if (err) {
                console.log(err);
            }
        });
    });
}
function closeReplyModal() {
    let modalContainer = document.querySelector(".reply-modal-container");
    if (modalContainer)
        modalContainer.style.display = "none";
    return;
}
function closeReplyModalListener() {
    document.body.addEventListener("click", (e) => {
        let el = e.target;
        if (el.classList.contains("close--reply--btn")) {
            closeReplyModal();
        }
    });
}
function openReplyModal(postId, replierId) {
    return __awaiter(this, void 0, void 0, function* () {
        let modalContainer = document.querySelector(".reply-modal-container");
        modalContainer.style.display = "flex";
        yield getTweetDataForReplyModal(postId, replierId)
            .then((data) => {
            if (data)
                insertReplyModalIntoDOM(data);
        })
            .catch((err) => {
            if (err) {
                console.log(err);
            }
        });
        return;
    });
}
function openReplyModalListener() {
    document.body.addEventListener("click", (e) => {
        let el = e.target;
        if (el.classList.contains("comment-post-icon")) {
            let postId = el.getAttribute("data-postId");
            let replierId = getCookie("loggedUser");
            if (postId && replierId)
                openReplyModal(postId, replierId);
        }
    });
}
function insertReplyModalIntoDOM(data) {
    let modal = document.querySelector(".reply-modal-container");
    if (modal)
        modal.innerHTML = `
  <div class="reply-modal-wrrapper">
        <span class="close__icon close--reply--btn"></span>
        <div class="post-container margin--top--2rem" data-id=${data.post._id}>
          <div class="post-header-wrrapper">
            <div class="profile-img-wrrapper">
              <img src=${data.post.postedBy.profilePic} />
            </div>
            <p class="user__name">${data.post.postedBy.name} ${data.post.postedBy.surname}</p>
            <p class="posted__date">${(0, moment_1.default)(data.post.createdAt, "YYYYMMDD").fromNow()} </div>
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
                    <button data-userId=${data.post.postedBy._id} data-postId=${data.post._id} data-replierId=${data.replier._id} type="submit" class="reply__btn">Reply</button>
                 </form>
             </div>
      </div>

  `;
    return;
}
function getTweetDataForReplyModal(postId, replierId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetch(`/post/replyModal/${postId}/${replierId}`).then((data) => data.json());
    });
}
function replyPostListener() {
    let replyModalContainer = document.querySelector(".reply-modal-container");
    if (replyModalContainer) {
        replyModalContainer.addEventListener("click", (e) => {
            e.preventDefault();
            let el = e.target;
            if (el.classList.contains("reply__btn")) {
                let postId = el.getAttribute("data-postId");
                let userId = el.getAttribute("data-userId");
                let replierId = el.getAttribute("data-replierId");
                let replyContent = document.querySelector("#reply__input");
                if (userId && postId && replierId && replyContent) {
                    postReplyTweet(userId, postId, replierId, replyContent.value);
                }
            }
        });
    }
}
function postReplyTweet(userId, postId, replierId, data) {
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
    let postsContainer = document.querySelector(".posts-container");
    if (postsContainer) {
        postsContainer.addEventListener("click", (e) => {
            let el = e.target;
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
function postRetweet(postId, userId, retweeterId) {
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
function incrementRetweetCount(postId) {
    let tweetCountList = document.querySelectorAll(".retweet-count");
    tweetCountList.forEach((tweetCount) => {
        let el = tweetCount;
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
function decrementRetweetCount(postId) {
    let tweetCountList = document.querySelectorAll(".retweet-count");
    tweetCountList.forEach((tweetCount) => {
        let el = tweetCount;
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
function getCookie(cookiename) {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
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
function addTweetsToDOM(data) {
    let userId = getCookie("loggedUser");
    let { posts } = data;
    if (posts.length > 0) {
        for (let index = 0; index < posts.length; index++) {
            if (posts[index].isRetweet == true &&
                userId != posts[index].postedBy._id &&
                posts[index].originalTweetSender._id != userId) {
                addRetweet(posts[index]);
            }
            if (posts[index].postedBy &&
                posts[index].isRetweet == false &&
                userId != posts[index].postedBy._id) {
                addOriginalTweet(posts[index]);
            }
        }
    }
}
function addOriginalTweet(data) {
    var _a, _b, _c, _d, _e, _f;
    let postsContainer = document.querySelector(".posts-container");
    let originalTweet = `
  <div class="post-container" data-id=${data === null || data === void 0 ? void 0 : data._id}>
  <div class="post-header-wrrapper">
    <div class="profile-img-wrrapper">
      <img src=${data.postedBy.profilePic}  />
    </div>
    <a href='/profile/details/${(_a = data.postedBy) === null || _a === void 0 ? void 0 : _a._id}'>
    <p class="user__name">${(_b = data.postedBy) === null || _b === void 0 ? void 0 : _b.name} ${(_c = data.postedBy) === null || _c === void 0 ? void 0 : _c.surname}</p>
    </a>
    <p class="posted__date">${(0, moment_1.default)(data === null || data === void 0 ? void 0 : data.createdAt).fromNow()}</p>
  </div>
  ${isReplyPost(data)}
  <div class="post-text-wrrapper">
    <p class="post__text" >${data === null || data === void 0 ? void 0 : data.content}</p>
  </div>
  <div class="post-interaction-wrrapper">
    <div class="post-icon-wrrapper">
          <span class="comment-post-icon" data-postId=${data === null || data === void 0 ? void 0 : data._id}></span>
          <span class="comment-count" data-postId=${data === null || data === void 0 ? void 0 : data._id}>${data === null || data === void 0 ? void 0 : data.replyCount}</span>
    </div>
    <div class="post-icon-wrrapper">
        <span class="loop-post-icon" data-userId=${(_d = data.postedBy) === null || _d === void 0 ? void 0 : _d._id} data-postId=${data === null || data === void 0 ? void 0 : data._id} ></span>
        <span class="retweet-count" data-postId=${data === null || data === void 0 ? void 0 : data._id}>${(_e = data === null || data === void 0 ? void 0 : data.retweeterList) === null || _e === void 0 ? void 0 : _e.length}</span>
    </div>
    <div class="post-icon-wrrapper">
      <span class="like-post-icon" data-postId=${data._id}></span>
      <span class="like-count" data-postId=${data._id}> ${(_f = data.likes) === null || _f === void 0 ? void 0 : _f.length} </span>
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
function addRetweet(data) {
    let postsContainer = document.querySelector(".posts-container");
    let retweet = `
  <div class="retweet-wrrapper" data-postId=${data._id} >
          <div class="post-header-wrrapper">
             <div class="profile-img-wrrapper">
                 <img src=${data.postedBy.profilePic} alt=${data.postedBy.profilePic}>
             </div>
  <a href='/profile/details/${data.postedBy._id}'>
                 <p class="user__name">${data.retweeter.name} ${data.retweeter.surname}</p>
  </a>
                 <p class="posted__date">${(0, moment_1.default)(data.createdAt).fromNow()}</p>
           </div>
      
      <div class="original-tweet-wrrapper">
           ${addNestedRetweet(data)}
      </div>
      <div class="post-interaction-wrrapper">
    <div class="post-icon-wrrapper">
          <span class="comment-post-icon" data-postId=${data._id}></span>
          <span class="comment-count" data-postId=${data._id}>${data.replyCount}</span>
    </div>
    <div class="post-icon-wrrapper">
        <span class="loop-post-icon" data-userId=${data.originalTweetSender._id} data-postId=${data.originalTweet._id} ></span>
        <span class="retweet-count" data-postId=${data.originalTweet._id}>${data.originalTweet.retweeterList.length}</span>
    </div>
    <div class="post-icon-wrrapper">
      <span class="like-post-icon" data-postId=${data._id}></span>
      <span class="like-count" data-postId=${data._id}> ${data.retweeterList.length} </span>
    </div>
    <div class="post-icon-wrrapper">
        <span class="upload-post-icon"></span>
    </div>
  </div>
  </div>
      
  `;
    postsContainer.innerHTML += retweet;
}
function addNestedRetweet(data) {
    let nestedTweet = `
  <div class="post-container" data-id=${data._id}>
  <div class="post-header-wrrapper">
    <div class="profile-img-wrrapper">
      <img src=${data.originalTweetSender.profilePic}  />
    </div>
    <a href='/profile/details/${data.originalTweetSender._id}'>
    <p class="user__name">${data.originalTweetSender.name} ${data.originalTweetSender.surname}</p>
  </a>
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
function getUnreadMessageCount() {
    let userId = getCookie("loggedUser");
    if (userId) {
        fetch(`/messages/unreadCount/${userId}`)
            .then((data) => {
            return data.json();
        })
            .then((data) => {
            if (data.unreadCount > 0) {
                let messageNotificationCounter = document.querySelector(".notification__message__counter");
                messageNotificationCounter.style.display = "flex";
                messageNotificationCounter.innerHTML = data.unreadCount.toString();
            }
            if (data.unreadCount === 0) {
                let messageNotificationCounter = document.querySelector(".notification__message__counter");
                messageNotificationCounter.style.display = "none";
            }
        })
            .catch((err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
//# sourceMappingURL=mainPage.js.map