(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}]},{},[1]);
