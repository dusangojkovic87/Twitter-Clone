import { User } from "./Interfaces/User";

document.addEventListener("DOMContentLoaded",(e:Event) =>{
    searchTwitterListener();
});




//search twitter users
function searchTwitterListener() {
  let searchField = document.querySelector(
    "#userSearchInput"
  ) as HTMLInputElement;

  searchField.addEventListener("input", (e: Event) => {
    let el = e.target as HTMLInputElement;

    if (el.value === "") {
      hideSearchTab();
    } else {
      showSearchTab();
      searchTwitter(el.value);
    }
  });
}

function searchTwitter(searchTerm: string) {
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

function insertSearhDataIntoDOM(data: any) {
  let resultContainer = document.querySelector(".search-result") as HTMLElement;
  let userHtml = "";
  data.forEach((user: User) => {
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
  let resultContainer = document.querySelector(".search-result") as HTMLElement;
  resultContainer.innerHTML = "<li style='text-align:center;'>No result</li>";
}

function hideSearchTab() {
  let resultTab = document.querySelector(
    ".show-search-result-container"
  ) as HTMLElement;
  resultTab.style.display = "none";
}

function showSearchTab() {
  let resultTab = document.querySelector(
    ".show-search-result-container"
  ) as HTMLElement;
  resultTab.style.display = "flex";
}
