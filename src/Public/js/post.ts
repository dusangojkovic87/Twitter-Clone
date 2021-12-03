
document.addEventListener("DOMContentLoaded", () => {
  /*post tweet*/
  let postContent = document.querySelector(
    ".post__tweet__input"
  ) as HTMLInputElement;
  let tweetBtn = document.querySelector(".tweet__btn") as HTMLButtonElement;

  tweetBtn.addEventListener("click", (e: Event) => {
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
          alert("posted succesfully!");
        }
      })
      .catch((err) => console.log(err));
  });

  /*REDIRECT TO POST BY ID*/

  let postContainers = document.querySelectorAll('.post-container') as NodeList;

  postContainers.forEach((postContainer:Node)=>{
    postContainer.addEventListener('click',(e:Event)=>{
       let div = e.target as HTMLElement;
       if(div.classList.contains('post-container')){
         let postId = div.getAttribute('data-id');
         window.location.href=`/post/${postId}`;
       }
    })

  })

  


});
