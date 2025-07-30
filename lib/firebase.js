
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {

  apiKey: "AIzaSyB84TgY0T0g8pmVuqSY24kEH0x9wIws7t0",

  authDomain: "localizando-e708c.firebaseapp.com",

  projectId: "localizando-e708c",

  storageBucket: "localizando-e708c.firebasestorage.app",

  messagingSenderId: "116503674969",

  appId: "1:116503674969:web:2722971d15a488a52c7148",

  measurementId: "G-44M1GMVLCC"

};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
