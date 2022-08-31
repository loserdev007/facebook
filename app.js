import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";
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


// Firebase Init
// firebase.initializeApp({
//    apiKey: "AIzaSyCvOuIXLm6MyTUFJF7tZ19ayOouogSLNhw",
//    authDomain: "custom-facebook-3ec5b.firebaseapp.com",
//    projectId: "custom-facebook-3ec5b",
//    storageBucket: "custom-facebook-3ec5b.appspot.com",
//    messagingSenderId: "845138997867",
//    appId: "1:845138997867:web:2744b7ae683a255424f72e"
// });
// const db = firebase.firestore();


// Defaults
const __fName = 'fname';
const __lName = 'lname';
const __email = 'email';
const __pass = 'pass';
const __id = 'ID';
const __fullName = 'fullname'


const __add = 'add';
const __delete = 'delete';
const __update = 'update';
const __read = 'read';


const __login = 'login';
const __signUp = 'signup';
const __cookieRemoveText = `; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
const __cookieKeyEmail = __email;
const __cookieKeyPass = __pass;
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




// const text = 'An obscure body in the S-K System, your majesty. The inhabitants refer to it as the planet Earth.';

async function digestMessage(message) {
   const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
   const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
   const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
   const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
   return hashHex;
}




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

const postContainer = document.getElementById('newsfeed');
const modalContainer = document.getElementById('modal-container');
const loginContainer = document.getElementById('sign-in');
const loginWait = document.querySelector('#sign-in .wait');
const logOut = document.getElementById('log-out');
// Sign Up
const signUpContainer = document.getElementById('sign-up');
const signUpWait = document.querySelector('#sign-up .wait');
const signUpSubmit = document.getElementById('sUp-submit');

const newPostContent = document.getElementById('newpost-content');
const postBtn = document.getElementById('new-post');
const postWait = document.querySelector('.add-post .wait');
const postModalContainer = document.getElementById('post-modal-container');


const postModalTrigger = document.getElementById('post-modal-trigger');


const userCollection = db.collection("users");
const postCollection = db.collection("posts");
const extraCollection = db.collection("extra");




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
      postWait.style.setProperty("display", "none", "important");
   }
}



function dbSet(collection, document, object, callBack) {
   collection.doc(document).set(object).then(() => callBack(true)).catch(() => callBack(false));
}

function dbAdd(collection, object, callBack) {
   collection.add(object).then(() => callBack(true)).catch(() => callBack(false));
}

function dbUpdate(collection, document, object, callBack) {
   collection.doc(document).update(object).then(() => callBack(true)).catch(() => callBack(false));
}

function dbGetAll(collection, callBack) {
   console.log("calsd")
   collection.get().then((doc) => {
      console.log("Done");
      callBack(doc)
   }).catch(() => false);
}



// function hasUserCookie(){
//    const cookieObj = cookieHandler(__read, []);
//    if (cookieObj.hasOwnProperty('email') && cookieObj.hasOwnProperty('pass')) return true;
//    else return false;
// }


function makeInputEmpty() {
   document.getElementById('sUp-fname').value = '';
   document.getElementById('sUp-lname').value = '';
   document.getElementById('sUp-email').value = '';
   document.getElementById('sUp-pass').value = '';
   document.getElementById('sIn-email').value = '';
   document.getElementById('sIn-pass').value = '';
   newPostContent.value = ''
}


// function initCheck(){
//    const cookiess = cookieHandler(__read, []);
//    const {email,pass} = cookiess;
//    digestMessage(cookiess[__email] + cookiess[__pass]).then((digestHex) => {
//       // console.log(digestHex);
//       db.collection("user").doc(digestHex).get().then((doc) => {
//          if (doc.exists && doc.data().email == email && doc.data().pass == pass) {
//             showData();
//          } else {
//             modalHandler(__login);
//          }
//       }).catch((error) => {

//       });
//    });
// }




function createCookie(contentObject) {
   document.cookie = `${__user}=${JSON.stringify(contentObject)}`;
   console.log("Created", document.cookie);
}

function readCookie() {
   let cookie = document.cookie;
   cookie = cookie.replace('user=', '');
   if(cookie) return JSON.parse(cookie)
   else return '';
}

function deleteCookie() {
   document.cookie = "user=" + __cookieRemoveText;
}



function cookieHandler(operation, contentObject) {
   if (operation == __add || operation == __update) {
      const isExist = document.cookie.includes('user=');
      if (isExist) {
         const obj = JSON.parse(document.cookie.replace('user='));
         Object.keys(obj).forEach(key => {
            obj[key] = contentObject[key]
         })
         document.cookie = `user=${JSON.stringify(obj)}`;
         console.log("Updated", document.cookie);
      } else {
         document.cookie = `user=${JSON.stringify(contentObject)}`;
         console.log("Created", document.cookie);
      }
      // for(const singlePair of pairs){
      //    document.cookie = `${singlePair.key}=${singlePair.content.trim()};`;
      // }
   }
   // else if(operation == __delete){
   //    for(const singlePair of pairs){
   //       document.cookie = `${singlePair.key}=;${__cookieRemoveText}`;

   //    }
   // }
   else if (operation == __read) {
      const cookies = document.cookie.replace('user=');
      console.log(JSON.parse(cookies));
      return JSON.parse(cookies);
   }
}




/**
 * GetUserDetails() returns the value from the readCookie() function.
 * @returns the value from the readCookie() function.
 */
function getUserDetails() {
   return readCookie()
}




// console.log(getUserDetails())


function signUp(fname, lname, email, pass) {
   const user = {
      [__fName]: fname,
      [__lName]: lname,
      [__email]: email,
      [__pass]: pass,
      [__fullName]: fname + " " + lname
   };
   dbSet(userCollection, email, user, () => {

      dbSet(extraCollection, email, {
         checked: false
      }, () => {

         createCookie(user);
         showPost();

      });

   });
}

function login(email, pass) {

   // const isSuccess =  dbUpdate(userCollection, email,{isLoggedIn: true});
   // if(isSuccess && !hasUserCookie()){
   //    cookieHandler(__add, {[__email]: email, [__pass]: pass})
   // }
   showData();


   // digestMessage(email + pass).then((digestHex) => {
   //    console.log(email,pass)
   //       db.collection("user").doc(digestHex).get().then((doc) => {
   //          if (doc.exists && doc.data().email == email && doc.data().pass == pass) {
   //             cookieHandler(
   //                __add,
   //                {
   //                   key: __email,
   //                   content: email
   //                },{
   //                   key: __pass,
   //                   content: pass
   //                },{
   //                   key: __fName,
   //                   content: doc.data()[__fName]
   //                },{
   //                   key: __lName,
   //                   content: doc.data()[__lName]
   //                },{
   //                   key: __id,
   //                   content: digestHex
   //                }
   //             )
   //             // modalHandler("");
   //             showData();
   //          }
   //       })
   //       .catch((error) => {
   //          console.error("Error adding document: ", error);
   //       });
   //    });
   // const emailCheck = db.collection("user").where("email", "==", email);
   // const passCheck = db.collection("user").where("pass", "==", pass);
   // console.log(emailCheck, passCheck);
   // if(email && pass){
   //    // console.log(passCheck.data());
   //    document.cookie = `a=|$#%|${email}|$#%|${pass}|$#%|${docRef.id};`;
   //    modalHandler('');
   //    showData();
   // }
}


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



function getFormattedTime() {
   const dateTime = getDateTime();
   return `<span class="time">${dateTime.hour}:${dateTime.minute} ${dateTime.dayPart}</span> - <span class="date">${dateTime.month} ${dateTime.day}, ${dateTime.year}</span>`;
}




function checkUser(callBack) {
   const user = getUserDetails();
   if (!user || !user[__email] || !user[__pass] || !user[__fName] || !user[__lName] || !user[__fullName] || user["isEmpty"]) callBack(false);
   dbUpdate(extraCollection, user[__email], {
      checked: false
   }, () => {
      callBack(true);
   })
}









function createPost(postContent) {
   /* return from getUserDetails() 

   minute: minutes,
   hour: hours,
   dayPart: ampm,
   day: day,
   month: month,
   year: year

   */

   checkUser(() => {

      console.log("asidaisvds")

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
      post['totalLikes'] = 0;



      dbAdd(postCollection, post, () => {

         // Post successfully added
         postModalContainer.style.setProperty("display", "none", "important");
         postWait.style.setProperty("display", "none", "important");
         makeInputEmpty();
      })
   })

   //    db.collection("posts").add(post).then((docRef) => {
   //       console.log("Document written with ID: ", docRef.id);
   //       showData();
   //   })
   //   .catch((error) => {
   //       console.error("Error adding document: ", error);
   //   });

   // let day = date.getDate();
   // let month = date.getMonth() + 1;
   // let year = date.getFullYear();

}



// Listeners
modalContainer.addEventListener('click', (e) => {
   if (e.target.nodeName == "BUTTON" && e.target.id == 'sUp-submit') {
      signUpWait.style.setProperty("display", "flex", "important");
      // console.log('askjdghaskd')
      const fName = document.getElementById('sUp-fname').value;
      const lName = document.getElementById('sUp-lname').value;
      const email = document.getElementById('sUp-email').value;
      const pass = document.getElementById('sUp-pass').value;

      if (!fName || !lName || !email || !pass) return
      // console.log('pass')
      signUp(fName, lName, email, pass);
   }
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




const showPost = () => {
   postContainer.innerHTML = '<h3 class="mb-3 text-center">All Posts</h3>';

   checkUser(() => {

      dbGetAll(postCollection, (allPosts) => {
         allPosts.forEach((singlePost) => {
            const singlePostData = singlePost.data();
            const userName = singlePostData.userDetails.userfullname;
            const totalLikes = singlePostData.totalLikes;
            const id = singlePost.id;
            const dateTime = singlePostData.formattedDateTime;
            const content = singlePostData.content;
            // let liked = 'dislike';

            const newPostElement = document.createElement('div');
            newPostElement.className = 'post ';
            newPostElement.dataset.postid = id;
            newPostElement.innerHTML = `<h4 class="user-name m-0">${userName}</h4><h5 class="post-details m-0">${dateTime}</h5><p class="content">${content}</p><div class="extras"><p class="total-likes mb-2"><span class="like">${totalLikes}</span> People liked this post</p><div class="feedback d-flex justify-content-between"><button class="btn react rounded-pill col-4" onclick="like(this)" data-postid="${id}" data-totalLikes="${totalLikes}" data-liked="${"liked"}">Like</button><button class="btn comment col-4 rounded-pill">Comment</button><button class="btn share rounded-pill col-4">Share</button></div></div>`;
            postContainer.append(newPostElement)
         })
      })
   })
};


// db.collection("posts").get().then((querySnapshot) => {
//    querySnapshot.forEach((doc) => {
//       //  console.log(`${doc.id} => ${doc.data()}`);
//       // console.log(doc.data());
//       // console.log("Showing Data")

//       db.collection("user").doc(cookieHandler(__read, [])[__id]).get().then((mdoc) => {
//          // console.log(doc.data());
//          let tmp = mdoc.data();
//          console.log(tmp.liked.includes(id));
//          tmp.liked.includes(id) ? liked = 'like' : liked = 'dislike';




//       }).catch((error) => {console.log("Get Error")});




//    });
//    modalHandler('');
// });


logOut.addEventListener('click', (e) => {
   // cookieHandler(
   //    __delete,
   //    {
   //       key: __email,
   //       content: ''
   //    },{
   //       key: __pass,
   //       content: ''
   //    },{
   //       key: __id,
   //       content: ''
   //    }
   // );
   modalHandler(__login);
})

postBtn.addEventListener('click', () => {
   const postContent = newPostContent.value;
   if (!postContent) return;
   postWait.style.setProperty("display", "flex", "important");
   createPost(postContent);
})
postModalTrigger.addEventListener('focusin', () => {
   postModalContainer.style.setProperty("display", "flex", "important");
})


// initCheck();


function like(e) {
   
   
   if (e.dataset.liked == 'like') {
      e.style.setProperty("background-color", '#3e4147', "important");
      e.dataset.liked = 'dislike';
   } else if (e.dataset.liked == 'dislike') {
      e.style.setProperty("background-color", '#374562', "important");
      e.dataset.liked = 'like';
   }




   
   dbUpdate(userCollection, getUserDetails()[__email], {
      liked: firebase.firestore.FieldValue.arrayUnion(e.dataset.postid)
   }, (isSuccess)=>{
      if(isSuccess){
         e.dataset.totallikes = parseInt(e.dataset.totallikes) + 1;
         e.closest('.extras').querySelector('span.like').textContent = e.dataset.totallikes;
      }else{
         console.log("fails")
         dbUpdate(userCollection, getUserDetails()[__email], {
            liked: firebase.firestore.FieldValue.arrayRemove(e.dataset.postid)
         }, (anotherSuccess)=>{
            if(anotherSuccess){
               e.dataset.totallikes = parseInt(e.dataset.totallikes) - 1;
               e.closest('.extras').querySelector('span.like').textContent = e.dataset.totallikes;
            }
         });
      }
   })





   // db.collection("user").doc(cookieHandler(__read, [])[__id]).get().then((doc) => {
   //    // console.log(doc.data());
   //    let tmp = doc.data();

   //    // Dislike
   //    if (tmp.liked.includes(e.dataset.postid)) {
   //       const index = tmp.liked.indexOf(e.dataset.postid);
   //       if (index > -1) { // only splice array when item is found
   //          tmp.liked.splice(index, 1); // 2nd parameter means remove one item only
   //       }
   //       doc.ref.update(tmp);
   //       db.collection('posts').doc(e.dataset.postid).update({
   //             totalLikes: parseInt(e.dataset.totallikes) - 1
   //          })
   //          .then(() => {
   //             e.dataset.totallikes = parseInt(e.dataset.totallikes) - 1;
   //             // console.log(e.closest('.extras').querySelector('span.like'));
   //             e.closest('.extras').querySelector('span.like').textContent = e.dataset.totallikes;
   //          })
   //          .catch((error) => {});
   //    }

   //    // Like
   //    else {
   //       tmp.liked.push(e.dataset.postid);
   //       doc.ref.update(tmp);
   //       db.collection('posts').doc(e.dataset.postid).update({
   //             totalLikes: parseInt(e.dataset.totallikes) + 1
   //          })
   //          .then(() => {
   //             e.dataset.totallikes = parseInt(e.dataset.totallikes) + 1;
   //             // console.log(e.closest('.extras').querySelector('span.like'));
   //             e.closest('.extras').querySelector('span.like').textContent = e.dataset.totallikes;
   //          })
   //          .catch((error) => {});
   //    }
   //    // liked: firebase.firestore.FieldValue.arrayUnion(cookieHandler(__read, [])[__id])
   //    // doc.data() is never undefined for query doc snapshots
   //    //   console.log(doc.id, " => ", doc.data());
   // }).catch((error) => {
   //    console.log("Error getting document:", error);
   // });



   // db.collection('user').where("liked", "array-contains", e.dataset.postid).get()
   // .then((querySnapshot) => {
   //     querySnapshot.forEach((doc) => {
   //         let tmp = doc.data();
   //         const index = array.indexOf(5);
   //         if (index > -1) { // only splice array when item is found
   //         array.splice(index, 1); // 2nd parameter means remove one item only
   //         }

   //         console.log(tmp);
   //         doc.ref.update(tmp);
   //        // liked: firebase.firestore.FieldValue.arrayUnion(cookieHandler(__read, [])[__id])
   //         // doc.data() is never undefined for query doc snapshots
   //         console.log(doc.id, " => ", doc.data());
   //     });
   // })
   // .catch((error) => {
   //     console.log("Error getting documents: ", error);
   // });
   //   db.collection('posts').doc(e.dataset.postid).update({
   //      // liked: firebase.firestore.FieldValue.arrayUnion(cookieHandler(__read, [])[__id])
   //      totalLikes: parseInt(e.dataset.totallikes) + 1
   //   })
   //   .then(() => {
   //      e.dataset.totallikes = parseInt(e.dataset.totallikes) + 1;
   //      // console.log(e.closest('.extras').querySelector('span.like'));
   //      e.closest('.extras').querySelector('span.like').textContent = e.dataset.totallikes;
   //  })
   //  .catch((error) => {
   //      // The document probably doesn't exist.
   //      console.error("Error updating document: ", error);
   //  });




   //    db.collection('user').doc(e.dataset.postid).update({
   //    // liked: firebase.firestore.FieldValue.arrayUnion(cookieHandler(__read, [])[__id])
   //       totalLikes: parseInt(e.dataset.totallikes) + 1
   //    })
   //    .then(() => {
   //       e.dataset.totallikes = parseInt(e.dataset.totallikes) + 1;
   //       // console.log(e.closest('.extras').querySelector('span.like'));
   //       e.closest('.extras').querySelector('span.like').textContent = e.dataset.totallikes;
   //    })
   //    .catch((error) => {
   //       // The document probably doesn't exist.
   //       console.error("Error updating document: ", error);
   //    });
}



function closeModal(e) {
   postModalContainer.style.setProperty("display", "none", "important");
   postWait.style.setProperty("display", "none", "important");
   makeInputEmpty();
}




checkUser((isSuccess)=>{
   if(isSuccess) showPost();
   else{

   }
})