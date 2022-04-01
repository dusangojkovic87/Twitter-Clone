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
Object.defineProperty(exports, "__esModule", { value: true });
const ioclient = __importStar(require("socket.io-client"));
document.addEventListener("DOMContentLoaded", () => {
    ioclient.connect("http://localhost:3000").on("likedPost", (data) => {
        if (data) {
            let { notificationInfo } = data;
            addSingleNotification(notificationInfo);
        }
    });
    getNotifications();
});
function getNotifications() {
    fetch("/notifications/getNotifications")
        .then((res) => {
        return res.json();
    })
        .then((data) => {
        if (data) {
            addNotificationsToDOM(data);
        }
    })
        .catch((err) => {
        if (err) {
            console.log(err);
        }
    });
}
function addNotificationsToDOM(data) {
    let notificationsContainer = document.querySelector(".notifications-container");
    let notification = "";
    for (let i = 0; i < data.length; i++) {
        notification += `
      <div class="notification-wrrapper">
                <div class="notification-header">
                    <span class="icon-bell"></span>
                    <div class="img-wrrapper">
                        <img src=${data[i].sender.profilePic} alt=${data[i].sender.profilePic}>
                    </div>
                    <a href="#">${data[i].sender.name} ${data[i].sender.surname}</a>
                </div>
                <div class="notification-content">
                   <p>${data[i].sender.name} ${data[i].sender.surname} ${data[i].content} </p>
                </div>
               
            </div>
      `;
    }
    notificationsContainer.innerHTML += notification;
}
function addSingleNotification(data) {
    let notificationsContainer = document.querySelector(".notifications-container");
    let html = ` <div class="notification-wrrapper">
    <div class="notification-header">
        <span class="icon-bell"></span>
        <div class="img-wrrapper">
            <img src=${data.sender.profilePic} alt=${data.sender.profilePic}>
        </div>
        <a href="#">${data.sender.name} ${data.sender.name}</a>
    </div>
    <div class="notification-content">
       <p>${data.sender.name} ${data.sender.surname} ${data.content} </p>
    </div>
   
</div>
    `;
    notificationsContainer.innerHTML += html;
}
//# sourceMappingURL=notification.js.map