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
exports.loadTweets = void 0;
const moment_1 = __importDefault(require("moment"));
let tweetMenuNav = document.querySelectorAll(".tweet__menu__nav");
let tweetContent = document.querySelector(".profile-tweet-content");
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
    }
    else if (window.location.href.indexOf("#replies") > -1) {
        getTweetsWithReplies();
        applyActiveBorderBottom(1);
        tweetContent.innerHTML = "";
    }
    else if (window.location.href.indexOf("#media") > -1) {
        applyActiveBorderBottom(2);
        tweetContent.innerHTML = "";
        tweetContent.innerHTML = "<h1>Media</h1>";
    }
    else if (window.location.href.indexOf("#likes") > -1) {
        tweetContent.innerHTML = "";
        getMyLikes();
        applyActiveBorderBottom(3);
    }
}
function applyActiveBorderBottom(linkNumber) {
    let link = tweetMenuNav[linkNumber];
    for (let i = 0; i <= 3; i++) {
        let t = tweetMenuNav[i];
        t.classList.remove("activeTweetMenu");
    }
    link.classList.add("activeTweetMenu");
}
function loadTweets() {
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
exports.loadTweets = loadTweets;
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
        .then((data) => data.json())
        .then((data) => {
        if (data.length === 0) {
            showEmptyProfileData("likes");
            return;
        }
        insertTweetsIntoDOM(data);
    });
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
function showEmptyProfileData(profileDataName) {
    if (tweetContent)
        tweetContent.innerHTML = `<h1 class='empty__profile__text' > No ${profileDataName} </h1>`;
}
function redirectToHomePageListener() {
    let backBtn = document.querySelector(".back__icon");
    backBtn.addEventListener("click", (e) => {
        window.location.href = "/";
        return;
    });
}
function partialProfileNavigationListener() {
    defaultPartialLoad();
    tweetMenuNav.forEach((tweetLink) => {
        let tweetLinkHTML = tweetLink;
        tweetLinkHTML.addEventListener("click", (e) => {
            e.preventDefault();
            let anc = e.target;
            if (anc.href.match("tweets")) {
                window.location.href = "profile#tweets";
                loadPartialPageBasedOnUrl();
            }
            else if (anc.href.match("replies")) {
                window.location.href = "profile#replies";
                loadPartialPageBasedOnUrl();
            }
            else if (anc.href.match("media")) {
                window.location.href = "profile#media";
                loadPartialPageBasedOnUrl();
            }
            else if (anc.href.match("likes")) {
                window.location.href = "profile#likes";
                loadPartialPageBasedOnUrl();
            }
        });
    });
}
function postEditProfileDataListener() {
    let userNameInfo = document.querySelector(".user__name__info");
    let userSurnameInfo = document.querySelector(".user__surname__info");
    let userBioInfo = document.querySelector(".user__bio__info");
    let userLocationInfo = document.querySelector(".user__location__info");
    let userBirthdateInfo = document.querySelector(".user__birthdate__info");
    let saveEditBtn = document.querySelector(".save__edit__btn");
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
    let profileImageInput = document.querySelector("#profileImageInput");
    profileImageInput.addEventListener("change", (e) => {
        let imageFile = e.target;
        if (!imageFile.files) {
            return;
        }
        /* preview profile img*/
        let preview = document.querySelector(".profile__preview");
        preview.src = URL.createObjectURL(imageFile.files[0]);
        preview.onload = () => {
            URL.revokeObjectURL(preview.src);
        };
    });
}
function backgroundProfileImagePreviewListener() {
    let bgImageInput = document.querySelector("#bgImgInput");
    bgImageInput.addEventListener("change", (e) => {
        let imageFile = e.target;
        if (!imageFile.files) {
            return;
        }
        /* preview bg img*/
        let preview = document.querySelector(".bg__preview");
        preview.src = URL.createObjectURL(imageFile.files[0]);
        preview.onload = () => {
            URL.revokeObjectURL(preview.src);
        };
    });
}
function openCloseProfileImageModalListener() {
    let profileImageModalBtn = document.querySelector(".add--main--img");
    let profileImageModal = document.querySelector(".upload-profile-img-modal");
    let closeAddProfileModal = document.querySelector(".close__add__profile");
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
    let addBgImageModal = document.querySelector(".upload-bg-img-modal");
    let addBgImageBtn = document.querySelector(".add--bg--image");
    let closeAddBgModal = document.querySelector(".close__add__bg");
    if (addBgImageBtn) {
        addBgImageBtn.addEventListener("click", (e) => {
            addBgImageModal.style.display = "flex";
        });
    }
    /* closes add bg modal */
    if (closeAddBgModal) {
        closeAddBgModal.addEventListener("click", (e) => {
            e.stopPropagation();
            addBgImageModal.style.display = "none";
        });
    }
}
function openAndCloseEditProfileModalListener() {
    let editProfileBtn = document.querySelector(".edit__profile__btn");
    let editProfileModal = document.querySelector(".edit-profile-modal-container");
    let closeModalBtn = document.querySelector(".close__edit__modal");
    let addBgImageModal = document.querySelector(".upload-bg-img-modal");
    editProfileModal.style.display = "none";
    addBgImageModal.style.display = "none";
    editProfileBtn.addEventListener("click", (e) => {
        editProfileModal.style.display = "flex";
        /*close modal if clicked outside modal */
        if (editProfileModal) {
            editProfileModal.addEventListener("click", (e) => {
                let modal = e.target;
                if (modal.classList.contains("edit-profile-modal-container")) {
                    modal.style.display = "none";
                }
            });
        }
        /* close modal button*/
        if (closeModalBtn) {
            closeModalBtn.addEventListener("click", (e) => {
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
    let tweetContent = document.querySelector(".profile-tweet-content");
    tweetContent.addEventListener("click", (e) => {
        let currentEl = e.target;
        if (currentEl.classList.contains("dots-icon")) {
            let modal = currentEl.previousElementSibling;
            if (modal) {
                modal.classList.toggle("open--delete--modal");
            }
        }
    });
}
function cancelDeleteTweetModalListener() {
    let tweetContent = document.querySelector(".profile-tweet-content");
    tweetContent.addEventListener("click", (e) => {
        let currentEl = e.target;
        if (currentEl.classList.contains("cancel__delete__tweet")) {
            let modal = currentEl.parentElement;
            if (modal) {
                modal.classList.toggle("open--delete--modal");
            }
        }
    });
}
function deleteTweetListener() {
    let tweetContent = document.querySelector(".profile-tweet-content");
    tweetContent.addEventListener("click", (e) => {
        var _a, _b;
        let curentEl = e.target;
        if (curentEl.classList.contains("delete__tweet__btn")) {
            let modal = (_b = (_a = curentEl.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
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
function deleteTweet(postId, userId) {
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
function getCookie(cookiename) {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}
function removeTweetFromDOMById(postId) {
    let postContainers = document.querySelectorAll(".post-container");
    postContainers.forEach((postContainer) => {
        let currentPost = postContainer;
        let postIdFromEl = currentPost.getAttribute("data-id");
        if (postIdFromEl === postId) {
            currentPost.remove();
        }
    });
    return;
}
function isReplyPost(reply) {
    if (reply.replyToUser != null || reply.replyToUser != undefined) {
        return `<p>replying to </p><a href="#">${reply.replyToUser.name} ${reply.replyToUser.surname}</a>`;
    }
    return "";
}
function addRetweetToProfile(data) {
    let postsContainer = document.querySelector(".profile-tweet-content");
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
function addOriginalTweetToProfile(data) {
    var _a;
    let postsContainer = document.querySelector(".profile-tweet-content");
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
//reply modal
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
function getTweetDataForReplyModal(postId, replierId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetch(`/post/replyModal/${postId}/${replierId}`).then((data) => data.json());
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
//retweet
function retweetPostListener() {
    let postsContainer = document.querySelector(".profile-tweet-content");
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
        let { postToDeleteId } = data;
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
//# sourceMappingURL=profilePage.js.map