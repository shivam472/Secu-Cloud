// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBk_jg1bDLRP4ELuY5POqmLD2BslEwW3L4",
  authDomain: "secucloud-e29cf.firebaseapp.com",
  projectId: "secucloud-e29cf",
  storageBucket: "secucloud-e29cf.appspot.com",
  messagingSenderId: "117276181002",
  appId: "1:117276181002:web:2324211cbb73e26d9995f3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);