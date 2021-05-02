import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA1--QmccNZeku2NY3IAanJsKtEksUZSEg",
    authDomain: "day2daypost.firebaseapp.com",
    projectId: "day2daypost",
    storageBucket: "day2daypost.appspot.com",
    messagingSenderId: "508200356101",
    appId: "1:508200356101:web:ba6515b201d7cf54108f6c",
    measurementId: "G-R0HQ7YZ1MK"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };