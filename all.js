import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getFirestore, collection, runTransaction ,addDoc, getDocs, doc, setDoc, writeBatch, updateDoc } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";
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
