"use strict";
document.addEventListener("DOMContentLoaded", () => {
    postTweetListener();
    /* redirectToPostByIdListener(); */
    redirectToDetailsPostListener();
});
function postTweetListener() {
    let postContent = document.querySelector(".post__tweet__input");
    let tweetBtn = document.querySelector(".tweet__btn");
    if (tweetBtn != null) {
        tweetBtn.addEventListener("click", (e) => {
            e.preventDefault();
            fetch("/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: postContent.value }),
            })
                .then((res) => res.json())
                .then((res) => {
                if (res.success === true) {
                    postContent.value = "";
                    window.location.reload();
                    alert("posted succesfully");
                }
            })
                .catch((err) => console.log(err));
        });
    }
}
function redirectToDetailsPostListener() {
    let postsContainer = document.querySelector(".posts-container");
    if (postsContainer) {
        postsContainer.addEventListener("click", (e) => {
            let el = e.target;
            if (el.classList.contains("post-container")) {
                let postId = el.getAttribute("data-id");
                window.location.href = `/post/${postId}`;
            }
        });
    }
}
//# sourceMappingURL=postPage.js.map