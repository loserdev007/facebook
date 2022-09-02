import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getFirestore, increment, collection, runTransaction ,addDoc, getDoc, getDocs, doc, setDoc, writeBatch, updateDoc } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";
const firebaseConfig = {
   apiKey: "AIzaSyCvOuIXLm6MyTUFJF7tZ19ayOouogSLNhw",
   authDomain: "custom-facebook-3ec5b.firebaseapp.com",
   databaseURL: "https://custom-facebook-3ec5b-default-rtdb.firebaseio.com",
   projectId: "custom-facebook-3ec5b",
   storageBucket: "custom-facebook-3ec5b.appspot.com",
   messagingSenderId: "845138997867",
   appId: "1:845138997867:web:2744b7ae683a255424f72e"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Defaults
const __fName = 'fname';
const __lName = 'lname';
const __email = 'email';
const __pass = 'pass';
const __id = 'ID';
const __fullName = 'fullname'


const __login = 'login';
const __signUp = 'signup';
const __cookieRemoveText = `; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
const __user = 'user';
const __post = 'post';


const __months = [
   'Jan',
   'Feb',
   'Mar',
   'Apr',
   'May',
   'Jun',
   'Jul',
   'Aug',
   'Sep',
   'Oct',
   'Nov',
   'Dec'
]




/**
 * This function can make a SHA-265 hash string from a plain text
 */
// async function digestMessage(message) {
//    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
//    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
//    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
//    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
//    return hashHex;
// }




/*
============================================================================================
   
   Utility Functions
   These functions are used to format, validate, remove or add to some specific contents
   
============================================================================================
*/

function addPad(num, digit) {
   num = num.toString();
   while (num.length < digit) num = "0" + num;
   return num;
}

const __userName = document.getElementById('user-name');



// Containers
const postContainer = document.getElementById('newsfeed');
const modalContainer = document.getElementById('modal-container');
const loginContainer = document.getElementById('sign-in');
const signUpContainer = document.getElementById('sign-up');
const newPostConfirmation = document.getElementById('post-confirmation');



// Progress bar
const loginWait = document.querySelector('#sign-in .wait');
const signUpWait = document.querySelector('#sign-up .wait');




// Submit buttons
const signUpSubmit = document.getElementById('sUp-submit');


// New post
const newPostContent = document.getElementById('newpost-content');
const postBtn = document.getElementById('new-post');



// Comments
const commentContent = document.getElementById('comment-content');


// NewsFeed
const newsfeed = document.getElementById('newsfeed');


const __userCollection = 'users';
const __postCollection = 'posts';
const __extraCollection = 'extra';



const logOut = document.getElementById('log-out');



function modalHandler(mode) {
   if (mode == __signUp) {
      // console.log("Signup Mode");
      modalContainer.style.setProperty("display", "flex", "important");
      loginContainer.style.setProperty("display", "none", "important");
      signUpContainer.style.setProperty("display", "flex", "important");
      postContainer.style.setProperty("display", "none", "important");
      postContainer.innerHTML = '<h3 class="mb-3 text-center">All Posts</h3>';
      makeInputEmpty();
   } else if (mode == __login) {
      // console.log("Login Mode");
      modalContainer.style.setProperty("display", "flex", "important");
      signUpContainer.style.setProperty("display", "none", "important");
      loginContainer.style.setProperty("display", "flex", "important");
      postContainer.style.setProperty("display", "none", "important");
      postContainer.innerHTML = '<h3 class="mb-3 text-center">All Posts</h3>';
      makeInputEmpty();
   } else {
      modalContainer.style.setProperty("display", "none", "important");
      signUpContainer.style.setProperty("display", "none", "important");
      loginContainer.style.setProperty("display", "none", "important");
      postContainer.style.setProperty("display", "block", "important");
      signUpWait.style.setProperty("display", "none", "important");
      loginWait.style.setProperty("display", "none", "important");
   }
}


function makeInputEmpty() {
   document.getElementById('sUp-fname').value = '';
   document.getElementById('sUp-lname').value = '';
   document.getElementById('sUp-email').value = '';
   document.getElementById('sUp-pass').value = '';
   document.getElementById('sIn-email').value = '';
   document.getElementById('sIn-pass').value = '';
   newPostContent.value = ''
}



/**
 * It creates a cookie with the name of the user and the content of the user object retrieved from the database.
 * @param contentObject - The object that you want to store in the cookie.
 */
function createCookie(contentObject) {
   document.cookie = `${__user}=${JSON.stringify(contentObject)}`;
   console.log("Created", document.cookie);
}

/**
 * It takes the cookie, removes the 'user=' part, and then parses the user object string JSON string
 * into a JavaScript object.
 * @returns The user information is being returned as a javascript object.
 */
function readCookie() {
   let cookie = document.cookie;
   cookie = cookie.replace('user=', '');
   if(cookie) return JSON.parse(cookie)
   else return '';
}

/**
 * This function deletes user object from the cookie
 */
function deleteCookie() {
   document.cookie = "user=" + __cookieRemoveText;
}


/**
 * GetUserDetails() returns the value from the readCookie() function.
 * @returns the value from the readCookie() function.
 */
function getUserDetails() {
   return readCookie()
}


/**
 * The sign up function that creates a user and add that to the database.
 * @param fname - First name
 * @param lname - Last Name,
 * @param email - the email of the user
 * @param pass - password
 */
async function signUp(fname, lname, email, pass) {
   const user = {
      [__fName]: fname,
      [__lName]: lname,
      [__email]: email,
      [__pass]: pass,
      [__fullName]: fname + " " + lname
   };
   
   // Write all at once
   const batch = writeBatch(db);
   batch.set(doc(db, __userCollection, email), user);
   batch.set(doc(db, __extraCollection, email), {checked: false, liked: []});

   try{
      await batch.commit();
      createCookie(user);
      showPost();
   }catch(e){
      
   }
   
}

function login(email, pass) {
   showData();
}

/**
 * It gets the current date and time and returns an object with the current date and time
 * @returns An object with the current date and time.
 */
function getDateTime() {
   const date = new Date();

   /* Checking if the hour is greater than 12, if it is, it will return PM, if not, it will return AM. */
   const ampm = date.getHours() > 12 ? 'PM' : 'AM';

   // Hours with formatting
   /* Getting the hours from the date object and then checking if it is 0. If it is 0, it is setting it
   to 12. If it is not 0, it is setting it to the hours. Then adding a zero to the front of the hours if it
   is less than 10. */
   let hours = date.getHours() % 12;
   hours = hours ? hours : 12;
   hours = addPad(hours, 2);

   // Minutes
   /* Getting the minutes from the date object and then adding a zero to the front of the minutes if it
   is less than 10. */
   let minutes = date.getMinutes();
   minutes = addPad(minutes, 2);

   // Date
   /* Getting the day of the month and adding a zero to the front of it if it is less than 10. */
   let day = date.getDate();
   day = addPad(day, 2);

   // Month
   /* Getting the month from the date object and assigning it to the variable month. */
   let month = __months[date.getMonth()];

   // Year
   /* Getting the current year. */
   const year = date.getFullYear();

   return {
      minute: minutes,
      hour: hours,
      dayPart: ampm,
      day: day,
      month: month,
      year: year
   }
}

/**
 * It returns a string that contains the current time and date in a format that is easy to read.
 * @returns a string that contains the time and date.
 */
function getFormattedTime() {
   const dateTime = getDateTime();
   return `<span class="time">${dateTime.hour}:${dateTime.minute} ${dateTime.dayPart}</span> - <span class="date">${dateTime.month} ${dateTime.day}, ${dateTime.year}</span>`;
}




/**
 * It checks if the user exists in the database and if it does, it updates the user's document with a
 * field called "checked" and sets it to true.
 * </code>
 * @returns {
 *   "checked": true,
 *   "email": "test@test.com",
 *   "firstName": "test",
 *   "lastName": "test",
 *   "fullName": "test test",
 *   "password": "test"
 * }
 */
async function checkUser() {
   const user = getUserDetails();
   if ( user == '' || !user[__email] || !user[__pass] || !user[__fName] || !user[__lName] || !user[__fullName]) return false;
   try{
      await updateDoc(doc(db, __extraCollection, user[__email]), {checked: true});
      console.log(user)
      return true;
   }catch(e){
      console.log("Couldn't find user :", e);
      return false;
   }
}



/**
 * It creates a new post and upload that to the databse
 * @param postContent - The content of the post
 */
async function createPost(postContent) {
   /* return from getUserDetails() 

   minute: minutes,
   hour: hours,
   dayPart: ampm,
   day: day,
   month: month,
   year: year

   */
   const userExist = await checkUser();
   if(userExist){

      console.log("Posting Start...");

      const post = {};
      const userDetails = getUserDetails();
      console.log(userDetails);
      post['content'] = postContent;
      post['userDetails'] = {
         userfname: userDetails[__fName],
         userlname: userDetails[__lName],
         userfullname: userDetails[__fullName],
         useremail: userDetails[__email]
      };
      post['totalLikes'] = 0;
      post['formattedDateTime'] = getFormattedTime();
      post['dateTime'] = getDateTime();

      try{

         // Post successfully added
         const addedPost = await addDoc(collection(db, __postCollection), post);
         console.log(addedPost);
         makeInputEmpty();
         post['react'] = 'dislike'
         post['postId'] = addedPost.id;
         // newsfeed.insertBefore(createPostElement(post), newsfeedTitle.nextSibling);
         // newsfeedTitle.after(createPostElement(post))
         const createdElement = createPostElement(post);
         createdElement.style.animationName = 'anm';
         postContainer.insertAdjacentElement('afterbegin', createdElement);

      }catch(e){
         // Couldn't add post
         console.log(e);
      }
   }
}


/* This function handles the sign up process. */
signUpSubmit.addEventListener('click', async()=>{
   signUpWait.style.setProperty("display", "flex", "important");
   const fName = document.getElementById('sUp-fname').value;
   const lName = document.getElementById('sUp-lname').value;
   const email = document.getElementById('sUp-email').value;
   const pass = document.getElementById('sUp-pass').value;
   const userExist = await checkUser();
   if(!userExist){
      await signUp(fName, lName, email, pass);
      makeInputEmpty();
      modalHandler('')
   }
})


// Listeners
modalContainer.addEventListener('click', (e) => {
   if (e.target.nodeName == "BUTTON" && e.target.id == 'sIn-submit') {
      loginWait.style.setProperty("display", "flex", "important");
      const email = document.getElementById('sIn-email').value;
      const pass = document.getElementById('sIn-pass').value;
      login(email, pass);
   }
   if (e.target.nodeName == "BUTTON" && e.target.id == 'sIn-change') {
      modalHandler('login');
   }
   if (e.target.nodeName == "BUTTON" && e.target.id == 'sUp-change') {
      modalHandler('signup');
   }
})


/**
 * It creates a new post element and returns it.
 * @param singlePostData - This is the object that contains all the data for a single post.
 * @returns A new post element.
 */
function createPostElement(singlePostData){
   const userName = singlePostData.userDetails.userfullname;
   const totalLikes = singlePostData.totalLikes;
   const id = singlePostData.postId;
   const dateTime = singlePostData.formattedDateTime;
   const content = singlePostData.content;
   const liked = singlePostData.react;
   
   const newPostElement = document.createElement('div');
   newPostElement.className = 'post';
   newPostElement.dataset.postid = id;
   newPostElement.innerHTML = `
   <h4 class="user-name m-0">${userName}</h4>
   <h5 class="post-details m-0">${dateTime}</h5>
   <p class="content">${content}</p>
   <div class="extras">
      <p class="total-likes mb-2">
      <span class="like">${totalLikes}</span> People liked this post</p>
      <div class="feedback d-flex justify-content-between">
         <button class="btn react rounded-pill col-4" data-postid="${id}" data-totalLikes="${totalLikes}" data-liked="${liked}">Like</button>
         <button class="btn comment col-4 rounded-pill">Comment</button>
         <button class="btn share rounded-pill col-4">Share</button>
      </div>
      <div class="comment-container">
         <div class="d-flex my-comment align-items-center">
            <textarea cols="30" rows="1" id="comment-content" class="w-100" placeholder="Share your opinion!"></textarea>
            <button class="rounded-pill"><i class="fa-regular fa-comment-dots"></i></button>
         </div>
      </div>
   </div>`;
   return newPostElement;
}


/*
   This function only shows posts after being confirmed about the user authentication.
   It will open login screen if it couldnt find any user. 
*/
async function showPost(){
   postContainer.innerHTML = '';
   
   try{
      const userInfo = getUserDetails();
      const userLikes = await getDoc(doc(db, __extraCollection, userInfo[__email]));
      const userLikeList = userLikes.data().liked;

      const allPosts = await getDocs(collection(db, __postCollection));

      allPosts.forEach((singlePost) => {
         const singlePostData = singlePost.data();
         singlePostData['postId'] = singlePost.id;
         singlePostData['react'] = userLikeList.includes(singlePost.id) ? 'like' : 'dislike';
         postContainer.append(createPostElement(singlePostData));
      })
      
   }catch(e){
      console.log("Couldn't show posts: ", e);
   }
};


/* Adding an event listener to the logOut button. When the button is clicked, the deleteCookie function
is called and the modalHandler function is called with the __login parameter. Mainly used for logging out.*/
logOut.addEventListener('click', (e) => {
   deleteCookie()
   modalHandler(__login);
})

/* The above code is adding an event listener to the post button. When the post button is clicked, the
value of the newPostContent is stored in the postContent variable. If the postContent variable is
empty, the function will return. If the postContent variable is not empty, the createPost function
will be called and the postContent variable will be passed as an argument. */
postBtn.addEventListener('click', () => {
   const postContent = newPostContent.value;
   if (!postContent) return;
   createPost(postContent);
})

/**
 * This event listener listen to the typing of new post textbox to open the post and cancel button and also
 * increase the height of the textbox
 */
newPostContent.addEventListener('input', ()=>{
   const clheight = newPostContent.clientHeight;
   const scrlHeight = newPostContent.scrollHeight;
   newPostConfirmation.style.setProperty("height", '60px', "important");
   console.log(clheight, scrlHeight);
   if(clheight < scrlHeight){
      console.log("inc")
      newPostContent.style.setProperty("height", scrlHeight + 'px', "important");
   }
})

/* 
   This event listener will listen from the newsfeed section. The listener will execute functions
   based on the button which are Like, Comment, and Share.
*/
newsfeed.addEventListener('click',async function(e) {
   const element = e.target;

   // Like Button is pressed
   if(element.nodeName == "BUTTON" && element.textContent == "Like"){


      if (element.dataset.liked == 'like') {
         element.style.setProperty("background-color", '#3e4147', "important");
         element.dataset.liked = 'dislike';
      } else if (element.dataset.liked == 'dislike') {
         element.style.setProperty("background-color", '#374562', "important");
         element.dataset.liked = 'like';
      }
      const postId = element.dataset.postid;
      try{
         const react = await runTransaction(db, async (transaction) => {
            const extraDoc = await transaction.get(doc(db, __extraCollection, getUserDetails()[__email]));
            if (!extraDoc.exists()) {
              throw "Document does not exist!";
            }
            const extraDocument = extraDoc.data();
            if(extraDocument.liked.includes(postId)){
               // Dislike
               const index = extraDocument.liked.indexOf(postId);
               if (index > -1) { // only splice array when item is found
                  extraDocument.liked.splice(index, 1); // 2nd parameter means remove one item only
               }
               transaction.update(doc(db, __extraCollection, getUserDetails()[__email]), { liked: extraDocument.liked });
               transaction.update(doc(db, __postCollection, postId), {totalLikes: increment(-1)});
               return false;
            }else{
               // Like
               extraDocument.liked.push(postId);
               transaction.update(doc(db, __extraCollection, getUserDetails()[__email]), { liked: extraDocument.liked });
               transaction.update(doc(db, __postCollection, postId), {totalLikes: increment(1)});
               return true;
            }
         });
         if(react){
            console.log("Liked");
            element.dataset.totallikes = parseInt(element.dataset.totallikes) + 1;
            element.closest('.extras').querySelector('span.like').textContent = element.dataset.totallikes;
         }else{
            console.log("disliked");
            element.dataset.totallikes = parseInt(element.dataset.totallikes) - 1;
            element.closest('.extras').querySelector('span.like').textContent = element.dataset.totallikes;
         }
         //  console.log("Transaction successfully committed!");
      }catch(e){
         // console.log("Couldn't like: ", e);
      }
   }


})




/**
 * This function check if the user is logged in or not. If not, it will open login screen, otherwise
 * it will show all posts.
 */
async function initCheck(){
   const isSuccess = await checkUser();
   if(isSuccess){
      const getUserName = getUserDetails()[__fullName];
      __userName.textContent = getUserName;
      showPost();
   }else{
      modalHandler(__login);
   }
}



initCheck()