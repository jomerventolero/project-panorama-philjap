import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAwLXSUFS1qv8VucFgHemgvErI3hC0kG7I",
    authDomain: "philjaps-prod.firebaseapp.com",
    projectId: "philjaps-prod",
    storageBucket: "philjaps-prod.appspot.com",
    messagingSenderId: "349994514863",
    appId: "1:349994514863:web:013c3a4a24bf1a2cf9575a",
    measurementId: "G-YN9LCGD03K"
};

let app;

if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const auth = app.auth();
const firestore = app.firestore();

export { app, auth, firebaseConfig, firestore };
