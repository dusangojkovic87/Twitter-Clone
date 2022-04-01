import moment from "moment";
import { User } from "./Interfaces/User";
import * as ioclient from "socket.io-client";

let selectedUserId = "";

document.addEventListener("DOMContentLoaded", (e: Event) => {
  searchUsersListener();
  selectUserToMessegeListener();
  sendMessageListener();
  setMessageASReadListener();
  getUnreadMessageCount();

  ioclient.connect("http://localhost:3000").on("messageSaved", (data) => {
    if (data) {
      addMessageToDOM(data);
    }
  });
});

function searchUsersListener() {
  let searchField = document.querySelector(
    "#searchPeopleChat"
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
  let loggedUserId = getCookie("loggedUser");
  data.forEach((user: User) => {
    if (user._id != loggedUserId) {
      userHtml += ` 
            <li>
                  <div class="user-list-item">
                        <img class="user__img" src=${user.profilePic} alt=${user.profilePic}>
                        <div class="username-wrrapper" data-userId=${user._id}>${user.name} ${user.surname}</div>                           
                  </div>
            </li> 
        `;
    }
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

function selectUserToMessegeListener() {
  let searchResult = document.querySelector(".search-result") as HTMLElement;
  if (searchResult) {
    searchResult.addEventListener("click", (e: Event) => {
      let el = e.target as HTMLElement;
      if (el.classList.contains("username-wrrapper")) {
        let userId = el.getAttribute("data-userId");
        if (userId) {
          getMessageReciverData(userId)
            .then((data) => {
              let { user } = data;
              if (user) {
                insertSelectedUserIntoDOM(user);
                //set id from selected user to global var
                selectedUserId = user._id;
                //get messages of selected user
                let loggedUserId = getCookie("loggedUser");
                if (selectedUserId && loggedUserId) {
                  getMessages(selectedUserId, loggedUserId);
                }
              }
            })
            .catch((err) => {
              if (err) {
                console.log(err);
              }
            });
        }
      }
    });
  }
}

async function getMessageReciverData(userId: string) {
  return await fetch(`/messages/getReciver/${userId}`)
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      return data;
    });
}

function insertSelectedUserIntoDOM(user: User) {
  console.log(user);
  let userWrrapper = document.querySelector(
    ".user-to-chat-wrrapper"
  ) as HTMLElement;
  let html = `
      <div class="img-wrrapper">
          <img src=${user.profilePic} alt=${user.profilePic} />
      </div>
      <div class="username-wrrapper">
                <p>${user.name} ${user.surname}</p>
      </div>
  `;

  userWrrapper.setAttribute("data-userId", user._id);
  userWrrapper.innerHTML = html;
}

function getCookie(cookiename: string) {
  // Get name followed by anything except a semicolon
  var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
  );
}

function sendMessageListener() {
  let sendBtn = document.querySelector(".plane-icon") as HTMLElement;
  let loggedUserId = getCookie("loggedUser");

  sendBtn.addEventListener("click", (e: Event) => {
    let chatInput = document.querySelector("#chatInput") as HTMLInputElement;
    let message = chatInput.value;

    if (selectedUserId && loggedUserId && message) {
      sendMessageToUser(selectedUserId, loggedUserId, message);
    }
  });
}

function sendMessageToUser(
  reciverId: string,
  senderId: string,
  message: string
) {
  fetch(`/messages/send/${reciverId}/${senderId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message }),
  })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      clearChatInput();
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
}

function getMessages(reciverId: string, senderId: string) {
  fetch(`/messages/getall/${reciverId}/${senderId}`)
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      if (data) {
        clearMessageTab();
        loadMessagesIntoDOM(data);
        scrollToBottomOfChat();
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
}

function loadMessagesIntoDOM(data: any) {
  let loggedUserId = getCookie("loggedUser");
  let messageContainer = document.querySelector(
    ".message-container"
  ) as HTMLElement;
  let html = ``;

  for (let index = 0; index < data.length; index++) {
    if (data[index].sender._id === loggedUserId) {
      html += `<div class="message-wrrapper align--self--start">
         <p>${data[index].content}</p>
         <p class="message__date"> ${moment(
           data[index].createdAt
         ).fromNow()} </p>
      </div>
        `;
    }

    if (data[index].sender._id !== loggedUserId) {
      html += `<div class="message-wrrapper bg--blue align--self--end">
         <p>${data[index].content}</p>
         <p class="message__date"> ${moment(
           data[index].createdAt
         ).fromNow()} </p>
      </div>
        `;
    }
  }

  messageContainer.innerHTML += html;
}

function clearMessageTab() {
  let messageContainer = document.querySelector(
    ".message-container"
  ) as HTMLElement;
  messageContainer.innerHTML = "";
}

function clearChatInput() {
  let chatInput = document.querySelector("#chatInput") as HTMLInputElement;
  chatInput.value = "";
}

function scrollToBottomOfChat() {
  let messageContainer = document.querySelector(
    ".message-container"
  ) as HTMLElement;
  let scrollHeight = messageContainer.scrollHeight;
  messageContainer.scrollTo(0, scrollHeight);
}

function addMessageToDOM(data: any) {
  let messageContainer = document.querySelector(
    ".message-container"
  ) as HTMLElement;
  let loggedUser = getCookie("loggedUser");
  let html = ``;

  if (data.message.sender._id === loggedUser) {
    html = `<div class="message-wrrapper align--self--start">
      <p>${data.message.content}</p>
      <p class="message__date"> ${moment(data.message.createdAt).fromNow()} </p>
   </div>
  `;
  }
  if (data.message.sender._id !== loggedUser) {
    html = `<div class="message-wrrapper align--self--end">
      <p>${data.message.content}</p>
      <p class="message__date"> ${moment(data.message.createdAt).fromNow()} </p>
   </div>
  `;
  }

  messageContainer.innerHTML += html;
  let scrollHeight = messageContainer.scrollHeight;

  messageContainer.scrollTo(0, scrollHeight);
}

function setMessageASReadListener(){
  let chatInput = document.querySelector("#chatInput") as HTMLInputElement;
  chatInput.addEventListener("keyup",(e:Event) =>{
    setMessageAsRead();
    getUnreadMessageCount();
   
  });

  }



function setMessageAsRead(){
  let messageSender = document.querySelector(".user-to-chat-wrrapper") as HTMLElement;
  let senderId = messageSender.getAttribute("data-userid");
  if(senderId === null || senderId === undefined){
    return;
  }

  let userId = getCookie("loggedUser");
  if(senderId && userId){
    fetch(`/messages/setAsRead/${senderId}/${userId}`,{
      method:"POST",
      headers:{ 'Content-Type': 'application/json'}
    })
    .then((data) =>{
      return data.json();
    })
    .then((data) =>{
      console.log(data)
    })
    .catch((err) =>{
      if(err){
        console.log(err);
      }
    })

  } 
}

function getUnreadMessageCount(){
  let userId = getCookie("loggedUser");
  if(userId){
  fetch(`/messages/unreadCount/${userId}`)
  .then((data) =>{
    return data.json();

  })
  .then((data) =>{
    console.log(data)
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