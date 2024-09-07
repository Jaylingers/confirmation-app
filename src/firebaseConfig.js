// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, listAll } from 'firebase/storage'; // Import listAll
import { getFirestore, doc, getDoc, setDoc, updateDoc, runTransaction } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDu5votDQ8JSlVXIxkhHq1SpW0N7i-dBrM",
    authDomain: "react-app-439f7.firebaseapp.com",
    databaseURL: "https://react-app-439f7.firebaseio.com",
    projectId: "react-app-439f7",
    storageBucket: "react-app-439f7.appspot.com",
    messagingSenderId: "484172897473",
    appId: "1:484172897473:web:fa2124d5aa60d80e004840",
    measurementId: "G-Q6T8LCMCN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore, ref, uploadBytes, listAll, doc, getDoc, setDoc, updateDoc, runTransaction };
