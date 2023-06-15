// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlEBvKpL1TmukKkrogSduxGntTXZU9Vs8",
  authDomain: "peluqueriasaltoque.firebaseapp.com",
  projectId: "peluqueriasaltoque",
  storageBucket: "peluqueriasaltoque.appspot.com",
  messagingSenderId: "641412947016",
  appId: "1:641412947016:web:5892bac03bd359445d8c7d",
  measurementId: "G-M9DBK59HND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth()
export const register = (createUserWithEmailAndPassword)