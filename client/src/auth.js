import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


const firebaseConfig = {
    
};

const app = firebase.initializeApp(firebaseConfig);

const auth = app.auth();

export { auth };
