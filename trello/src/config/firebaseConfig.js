import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyDl56kJIH-zFGRbQhYz8ncIlOdmotIT-1c",
    authDomain: "trello-f5f19.firebaseapp.com",
    databaseURL: "https://trello-f5f19.firebaseio.com",
    projectId: "trello-f5f19",
    storageBucket: "trello-f5f19.appspot.com",
    messagingSenderId: "356425929374",
    appId: "1:356425929374:web:191692eef10eafa25e618f",
    measurementId: "G-46DE5M8EM2"
};

const app = firebase.initializeApp(firebaseConfig);
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
firebase.analytics();

export {app, googleAuthProvider, facebookAuthProvider};