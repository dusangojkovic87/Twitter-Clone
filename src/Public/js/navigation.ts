import * as ioclient from "socket.io-client";
document.addEventListener("DOMContentLoaded",() =>{
    ioclient.connect("http://localhost:3000")
    .on("likedPost",(data) =>{
        let {notificationInfo} = data;
        let loggedUserId = getCookie("loggedUser");
        if(notificationInfo.reciver === loggedUserId ){
            setNotificationCounter();
        }
    })
    .on("messageSaved",(data) =>{
        let loggedUserId = getCookie("loggedUser");
        if(data.message.reciver === loggedUserId){
            setMessageNotification();
        }
    })
    
});

function setNotificationCounter(){
    let notificationCounter = document.querySelector(".notification__counter") as HTMLElement;
    notificationCounter.style.display = "flex";
    let currentCount = notificationCounter.innerHTML;
    let incresedCount = Number(currentCount) + 1;
    notificationCounter.innerHTML = incresedCount.toString();
}

function setMessageNotification(){
    let messageNotificationCounter = document.querySelector(".notification__message__counter") as HTMLElement;
    messageNotificationCounter.style.display = "flex";
    let currentCount = messageNotificationCounter.innerHTML;
    let incresedCount = Number(currentCount) + 1;
    messageNotificationCounter.innerHTML = incresedCount.toString();
}

function getCookie(cookiename: string) {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(
      !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
    );
  }

  