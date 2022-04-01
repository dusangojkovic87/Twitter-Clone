"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const ioclient = __importStar(require("socket.io-client"));
let selectedUserId = "";
document.addEventListener("DOMContentLoaded", (e) => {
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
    let searchField = document.querySelector("#searchPeopleChat");
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
    let loggedUserId = getCookie("loggedUser");
    data.forEach((user) => {
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
function selectUserToMessegeListener() {
    let searchResult = document.querySelector(".search-result");
    if (searchResult) {
        searchResult.addEventListener("click", (e) => {
            let el = e.target;
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
function getMessageReciverData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetch(`/messages/getReciver/${userId}`)
            .then((data) => {
            return data.json();
        })
            .then((data) => {
            return data;
        });
    });
}
function insertSelectedUserIntoDOM(user) {
    console.log(user);
    let userWrrapper = document.querySelector(".user-to-chat-wrrapper");
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
function getCookie(cookiename) {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}
function sendMessageListener() {
    let sendBtn = document.querySelector(".plane-icon");
    let loggedUserId = getCookie("loggedUser");
    sendBtn.addEventListener("click", (e) => {
        let chatInput = document.querySelector("#chatInput");
        let message = chatInput.value;
        if (selectedUserId && loggedUserId && message) {
            sendMessageToUser(selectedUserId, loggedUserId, message);
        }
    });
}
function sendMessageToUser(reciverId, senderId, message) {
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
function getMessages(reciverId, senderId) {
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
function loadMessagesIntoDOM(data) {
    let loggedUserId = getCookie("loggedUser");
    let messageContainer = document.querySelector(".message-container");
    let html = ``;
    for (let index = 0; index < data.length; index++) {
        if (data[index].sender._id === loggedUserId) {
            html += `<div class="message-wrrapper align--self--start">
         <p>${data[index].content}</p>
         <p class="message__date"> ${(0, moment_1.default)(data[index].createdAt).fromNow()} </p>
      </div>
        `;
        }
        if (data[index].sender._id !== loggedUserId) {
            html += `<div class="message-wrrapper bg--blue align--self--end">
         <p>${data[index].content}</p>
         <p class="message__date"> ${(0, moment_1.default)(data[index].createdAt).fromNow()} </p>
      </div>
        `;
        }
    }
    messageContainer.innerHTML += html;
}
function clearMessageTab() {
    let messageContainer = document.querySelector(".message-container");
    messageContainer.innerHTML = "";
}
function clearChatInput() {
    let chatInput = document.querySelector("#chatInput");
    chatInput.value = "";
}
function scrollToBottomOfChat() {
    let messageContainer = document.querySelector(".message-container");
    let scrollHeight = messageContainer.scrollHeight;
    messageContainer.scrollTo(0, scrollHeight);
}
function addMessageToDOM(data) {
    let messageContainer = document.querySelector(".message-container");
    let loggedUser = getCookie("loggedUser");
    let html = ``;
    if (data.message.sender._id === loggedUser) {
        html = `<div class="message-wrrapper align--self--start">
      <p>${data.message.content}</p>
      <p class="message__date"> ${(0, moment_1.default)(data.message.createdAt).fromNow()} </p>
   </div>
  `;
    }
    if (data.message.sender._id !== loggedUser) {
        html = `<div class="message-wrrapper align--self--end">
      <p>${data.message.content}</p>
      <p class="message__date"> ${(0, moment_1.default)(data.message.createdAt).fromNow()} </p>
   </div>
  `;
    }
    messageContainer.innerHTML += html;
    let scrollHeight = messageContainer.scrollHeight;
    messageContainer.scrollTo(0, scrollHeight);
}
function setMessageASReadListener() {
    let chatInput = document.querySelector("#chatInput");
    chatInput.addEventListener("keyup", (e) => {
        setMessageAsRead();
        getUnreadMessageCount();
    });
}
function setMessageAsRead() {
    let messageSender = document.querySelector(".user-to-chat-wrrapper");
    let senderId = messageSender.getAttribute("data-userid");
    if (senderId === null || senderId === undefined) {
        return;
    }
    let userId = getCookie("loggedUser");
    if (senderId && userId) {
        fetch(`/messages/setAsRead/${senderId}/${userId}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        })
            .then((data) => {
            return data.json();
        })
            .then((data) => {
            console.log(data);
        })
            .catch((err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}
function getUnreadMessageCount() {
    let userId = getCookie("loggedUser");
    if (userId) {
        fetch(`/messages/unreadCount/${userId}`)
            .then((data) => {
            return data.json();
        })
            .then((data) => {
            console.log(data);
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
//# sourceMappingURL=messagePage.js.map