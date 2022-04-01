import { Notification } from "./Interfaces/Notification";
import * as ioclient from "socket.io-client";

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

function addNotificationsToDOM(data: Array<Notification>) {
  let notificationsContainer = document.querySelector(
    ".notifications-container"
  ) as HTMLElement;
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

function addSingleNotification(data: Notification) {
  let notificationsContainer = document.querySelector(
    ".notifications-container"
  ) as HTMLElement;
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
