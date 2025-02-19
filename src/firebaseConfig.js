
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyAjnJGlSyygZbYGDSuOSWP466IwkpCkgtA",
  authDomain: "weather-app-react-91b48.firebaseapp.com",
  projectId: "weather-app-react-91b48",
  storageBucket: "weather-app-react-91b48.appspot.com", 
  messagingSenderId: "871228003002",
  appId: "1:871228003002:web:b5b8f0ae9bf3af7ecf6883",
  measurementId: "G-NZDES0YGT8"
};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app); 
const db = getFirestore(app);
const storage = getStorage(app); 
const analytics = getAnalytics(app); 


export { app, auth, db, storage, analytics };
