import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


const firebaseConfig = {

    "apiKey": "AIzaSyAKUyLmRjZaMHTpgWttqIDZe-s168VnGeM",
  
    "authDomain": "philjaps.firebaseapp.com",
  
    "projectId": "philjaps",
  
    "storageBucket": "philjaps.appspot.com",
  
    "messagingSenderId": "594380973782",
  
    "appId": "1:594380973782:web:7f69d38c84b138a3084b77",
  
    "measurementId": "G-KCMKNEHBK1"
  
  };
  


const app = firebase.initializeApp(firebaseConfig);

const auth = app.auth();

export { app, auth, firebaseConfig };
