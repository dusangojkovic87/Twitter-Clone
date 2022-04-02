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


    openPostTweetModalListener();
    closePostTweetModalListener();
    postTweetFromModal();
    
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

//post tweet modal
function openPostTweetModalListener(){
  let navigationWrrapper = document.querySelector(".main-navigation-wrrapper") as HTMLElement;
  let modal = document.querySelector(".post-tweet-modal-container") as HTMLElement;

  navigationWrrapper.addEventListener("click",(e:Event) =>{
      let el = e.target as HTMLElement;
      if(el.classList.contains("tweet__button")){
          modal.style.display = "flex";
          
      }

  })
}

function closePostTweetModalListener(){
    let modal = document.querySelector(".post-tweet-modal-container") as HTMLElement;
    document.addEventListener("click",(e:Event) =>{
        let el = e.target as HTMLElement;
        if(el.classList.contains("close__modal")){
            modal.style.display = "none";

        }

    });
}

function postTweetFromModal(){
    document.addEventListener("click",(e:Event) =>{
        let el = e.target as HTMLElement;
        if(el.classList.contains("submit__tweet__btn")){
            let tweetInput = document.querySelector("#tweetInput") as HTMLInputElement;
            fetch("/post",{
                method:"POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({content:tweetInput.value})
            })
            .then((res) => res.json())
            .then((res) =>{
                clearModalInputAndClose();
              
            })
            .catch((err) =>{
                if(err){
                    console.log(err);
                }
            })

        }

    });
}

function clearModalInputAndClose(){
    let modal = document.querySelector(".post-tweet-modal-container") as HTMLElement;
    modal.style.display = "none";
    let tweetInput = document.querySelector("#tweetInput") as HTMLInputElement;
    tweetInput.value = "";


}





  