// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "d0ll4r-s1n3.firebaseapp.com",
  projectId: "d0ll4r-s1n3",
  storageBucket: "d0ll4r-s1n3.firebasestorage.app",
  messagingSenderId: "506575128884",
  appId: "1:506575128884:web:6383c4789b477ce48e3d61",
  measurementId: "G-DKBDPP8MC7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

// export { app, analytics, db };
export { app, db };
