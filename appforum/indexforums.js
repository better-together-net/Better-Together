// global selectors to get the input box for title, description and share button

const postTitleInput2 = document.querySelector("#title");
const postDescriptionInput2 = document.querySelector("#comment");
const postB2 = document.querySelector("#postB");

// function for getting the user input and pasting it in the js array that will be passed to the serverless function
function addingPost() {
  let postTitle2 = postTitleInput2.value;
  let postDescription2 = postDescriptionInput2.value;
  var now = new Date();
  var date = moment(now).format("LLL");
  // we create the js  array containing js objects
  let array = [
    { title: postTitle2, content: postDescription2, created_at: date },
  ];
  // print out the array
  console.log(array);
  // fetch the serverless function to pass the array to the database
  if (postTitle2 == "") {
    alert("Your post has to have a title");
  } else if (postDescription2 == "") {
    alert("Your post has to have a description");
  } else {
    fetch("..//.netlify/functions/createPosts", {
      method: "POST",
      body: JSON.stringify(array),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        alert("Your question has been posted successfully to our Forum");
        takeToForum();
      })
      .catch((error) => console.error(error));
  }
}

// we activate this function every time the user clicks on the share button so every time when he creates a new share
postB2.addEventListener("click", addingPost);

function takeToForum() {
  window.location.href = "/appforum/indexForum.html";
}
