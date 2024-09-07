// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, listAll } from 'firebase/storage'; // Import listAll
import { getFirestore, doc, getDoc, setDoc, updateDoc, runTransaction } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB0Ni8CHM7Thr1Au59O3rRfcFWdzVAt8ag",
    authDomain: "kus-dev.firebaseapp.com",
    projectId: "kus-dev",
    storageBucket: "kus-dev.appspot.com",
    messagingSenderId: "289519175655",
    appId: "1:289519175655:web:28ad911218b37f8adfdf42",
    measurementId: "G-BWV0S4RY3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore, ref, uploadBytes, listAll, doc, getDoc, setDoc, updateDoc, runTransaction };
