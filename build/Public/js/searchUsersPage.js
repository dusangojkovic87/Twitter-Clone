"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
document.addEventListener("DOMContentLoaded", (e) => {
    searchTwitterListener();
});
//search twitter users
function searchTwitterListener() {
    let searchField = document.querySelector("#userSearchInput");
    searchField.addEventListener("input", (e) => {
        let el = e.target;
        if (el.value === "") {
            hideSearchTab();
        }
        else {
            showSearchTab();
            searchTwitter(el.value);
        }
    });
}
function searchTwitter(searchTerm) {
    if (searchTerm != "") {
        fetch(`/home/searchTwitter/${searchTerm}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        })
            .then((data) => {
            return data.json();
        })
            .then((data) => {
            if (data.length > 0) {
                insertSearhDataIntoDOM(data);
                return;
            }
            if (data.length === 0) {
                searchNoResult();
            }
        });
    }
}
function insertSearhDataIntoDOM(data) {
    let resultContainer = document.querySelector(".search-result");
    let userHtml = "";
    data.forEach((user) => {
        userHtml += ` 
    <a href='/profile/details/${user._id}'>
          <li>
                <div class="user-list-item">
                      <img class="user__img" src=${user.profilePic} alt=${user.profilePic}>
                      <div class="username-wrrapper">${user.name} ${user.surname}</div>                           
                </div>
          </li> 
    </a>
      `;
    });
    resultContainer.innerHTML = userHtml;
}
function searchNoResult() {
    let resultContainer = document.querySelector(".search-result");
    resultContainer.innerHTML = "<li style='text-align:center;'>No result</li>";
}
function hideSearchTab() {
    let resultTab = document.querySelector(".show-search-result-container");
    resultTab.style.display = "none";
}
function showSearchTab() {
    let resultTab = document.querySelector(".show-search-result-container");
    resultTab.style.display = "flex";
}
//# sourceMappingURL=searchUsersPage.js.map