// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAW-NHLlZlRhJ7zxWhFwiSsQHC9Nc62TC4",
  authDomain: "icarus-one.firebaseapp.com",
  projectId: "icarus-one",
  storageBucket: "icarus-one.firebasestorage.app",
  messagingSenderId: "796956832523",
  appId: "1:796956832523:web:31b9102b2e35a2d4c4e80e",
  measurementId: "G-LL694WW8K2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

// export { app, analytics, db };
export { app, db };
