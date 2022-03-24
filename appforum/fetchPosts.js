/*
//local storage transfer from log in
// transfers sessionStorage from one tab to another
var sessionStorage_transfer = function (event) {
  if (!event) {
    event = window.event;
  } // ie suq
  if (!event.newValue) return; // do nothing if no value to work with
  if (event.key == "getSessionStorage") {
    // another tab asked for the sessionStorage -> send it
    localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
    // the other tab should now have it, so we're done with it.
    localStorage.removeItem("sessionStorage"); // <- could do short timeout as well.
  } else if (event.key == "sessionStorage" && !sessionStorage.length) {
    // another tab sent data <- get it
    var data = JSON.parse(event.newValue);
    for (var key in data) {
      sessionStorage.setItem(key, data[key]);
    }
  }
};

// listen for changes to localStorage
if (window.addEventListener) {
  window.addEventListener("storage", sessionStorage_transfer, false);
} else {
  window.attachEvent("onstorage", sessionStorage_transfer);
}

// Ask other tabs for session storage (this is ONLY to trigger event)
if (!sessionStorage.length) {
  localStorage.setItem("getSessionStorage", "foobar");
  localStorage.removeItem("getSessionStorage", "foobar");
}

console.log(sessionStorage.getItem("getSessionStorage"));
// End of getting the local storage from log in */
console.log(localStorage.getItem("getSessionStorage"));

var id = 1;

// display comments saved in the database
async function fetchPostsWithComments() {
  await getPosts().then((result) => {
    var timeout = setTimeout(getComments, 2300);
  });
}

async function getPosts() {
  fetch("../.netlify/functions/displayPosts")
    .then((response) => response.json())
    .then((json) => {
      json.forEach((item) => {
        let postDescription = item.content;
        let postTitle = item.title;
        let postDate = item.created_at;
        let postAuthor = item.author;
        let frame = document.createElement("div");
        frame.className = "frame";
        frame.id = `post${id}`;

        let addReadMore = false;
        var secondSpan;

        try {
          let count = postDescription.length;
          if (count > 1250) {
            const firstSpan = postDescription.substring(0, 1250);
            secondSpan = postDescription.substring(1250, count);
            postDescription = firstSpan;
            addReadMore = true;
          }

          if (addReadMore) {
            frame.innerHTML = ` 
                <div class="authorDateTag">
                <img class="picture" src="/imgs/50x50picture.png" alt="">
                <!-- <div class="picture" ></div> -->
                 <div class="authorTag">${postAuthor}</div>
                 <div class="dateTag">${postDate}</div>
                 <h4 class="noteTitle" > ${postTitle}</h4> 
               </div>
                 <div class="noteDescription"> <span> ${postDescription} </span> <span class="readMoreTag" onclick="readMore('${`post${id}`}')">...Read more</span> <span class="secondPart">${secondSpan}</span></div> 
                <div class="postBtns">
                   <button onclick="showPanel('${`post${id}`}')"  class="commentBtn"> Comment</button> 
                    <button onclick="reportUI()" class="repButton">Report</button>   
               </div>
                `;
          } else {
            frame.innerHTML = ` 
                <div class="authorDateTag">
                <img class="picture" src="/imgs/50x50picture.png" alt="">
                <!-- <div class="picture" ></div> -->
                 <div class="authorTag">${postAuthor}</div>
                 <div class="dateTag">${postDate}</div>
                 <h4 class="noteTitle" > ${postTitle}</h4> 
               </div>
                 <div class="noteDescription">  ${postDescription}  </div> 
                <div class="postBtns">
                   <button onclick="showPanel('${`post${id}`}')"  class="commentBtn"> Comment</button> 
                   <button onclick="reportUI()" class="repButton">Report</button>  
               </div>
                `;
          }
          // Comments section

          let comPanel = document.createElement("div");
          comPanel.className = "panel";
          frame.appendChild(comPanel);
          let commentS = document.createElement("div");
          commentS.className = "comments";
          comPanel.appendChild(commentS);
          comPanel.innerHTML = `
          <div class="comments"> </div> 
          <span class="commentLine">  <textarea id="'${`post${id}`}' " onfocus="resizerSelector('${`post${id}`}')" class="areaT" placeholder="Type in your comment"></textarea><button type="submit" onclick="addComment('${`post${id}`}')"  class="btn btn-info btn-sm shadow-none text-left" >Comment</button> </span>
          `;
        } catch (error) {
          console.log("This Post has an empty description");
        }
        id++;
        document.querySelector("main").appendChild(frame);
      });
    });
}

async function getComments() {
  fetch("../.netlify/functions/displayComments")
    .then((response) => response.json())
    .then((json) => {
      json.forEach((item) => {
        var comment = document.createElement("div");
        comment.className = "comment";
        let fetchedComment = item.comContent;
        let fetchedCommentDate = item.createdAt;
        comment.innerHTML = `
      <span class="wide"><img class="picture" src="/imgs/50x50picture.png"> <span class="commentAuthor" onclick="HPprofile()">Mike Miller</span> </span>
      <div class="comDateTag"> ${fetchedCommentDate}</div> 
      <div class="commentText"> ${fetchedComment} </div> 
      `;
        var commentID = item.postIdent;
        var commentsSection = document.querySelector(`#${commentID} .comments`);
        commentsSection.appendChild(comment);
      });
    });
}

fetchPostsWithComments();

function readMore(element) {
  let spanToShow = document.querySelector(`#${element} .secondPart`);
  let spanToHide = document.querySelector(`#${element} .readMoreTag`);
  spanToShow.style.display = "inline-block";
  spanToHide.remove();
}

// open the panel function
function showPanel(element) {
  let panel = document.querySelector(`#${element} .panel`);
  panel.className = "panel";
  if (panel.style.display === "block") {
    panel.style.display = "none";
  } else {
    panel.style.display = "block";
  }
}

// adding new comments to the comment panel
function addComment(element) {
  var comment = document.createElement("div");
  comment.className = "comment";
  var comInput = document.querySelector(`#${element} .areaT`);
  let inputValue = comInput.value;
  var now = new Date();
  var comDate = moment(now).format("LLL");
  console.log(comDate);
  console.log(now);
  comment.innerHTML = `
        <span class="wide"><img class="picture" src="/imgs/50x50picture.png"> <span class="commentAuthor" onclick="HPprofile()">Mike Miller</span> </span>
        <div class="comDateTag"> ${comDate}</div> 
        <div class="commentText"> ${inputValue} </div> 
      `;
  if (inputValue === "") {
    alert("You cannot post an empty comment!");
  } else {
    var commentsSection = document.querySelector(`#${element} .comments`);
    commentsSection.appendChild(comment);
    let comArray = [
      { createdAt: comDate, comContent: inputValue, postIdent: element },
    ];
    console.log(comArray);
    fetch("..//.netlify/functions/saveComments", {
      method: "POST",
      body: JSON.stringify(comArray),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => response.json())
      .then((json) => console.log(json))
      .catch((error) => console.error(error));
  }
}
/* will be added once Ali completes this UI
function HPprofile() {
  window.location.href = "/HPprofile/profile.html";
}
*/

function reportUI() {
  window.location.href = "/reportPost/reportPost.html";
}

// comment input resizer
function resizerSelector(element) {
  var textArea = document.querySelector(`#${element} .areaT`);
  textAreaTBR = textArea;

  textAreaTBR.addEventListener("keyup", (e) => {
    let scHeight = e.target.scrollHeight;
    textArea.style.height = `${scHeight}px`;
  });
}

//Moment library dates
/* 
let now = new Date();
var dateString = moment(now).format("YYYY-MM-DD");
console.log(dateString);


console.log(dateStringWithTime); // Output: 2020-07-21 07:24:06
*/
// disable enable the display of the log out button
const logOutB = document.querySelector("#LO");

if (!localStorage.length) {
  logOutB.style.display = "none";
}

logOutB.addEventListener("click", function () {
  localStorage.clear();
  alert("You have been logged out successfully");
  logOutB.style.display = "none";
  logInB.style.display = "inline-block";
  regB.style.display = "inline-block";
});

// disable enable the display of the log in  and register button
const logInB = document.querySelector("#LI");
const regB = document.querySelector("#R");
console.log(logInB);

if (localStorage.length) {
  logInB.style.display = "none";
  regB.style.display = "none";
}
