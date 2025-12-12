import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCKJjjG0ZwZjVVCRZyTdjXLU416qirctoI",
    authDomain: "casa-colchones.firebaseapp.com",
    projectId: "casa-colchones",
    storageBucket: "casa-colchones.firebasestorage.app",
    messagingSenderId: "866582261308",
    appId: "1:866582261308:web:749fbae1af2a2cbd769d39",
    measurementId: "G-8DJQZPCEL7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { db, analytics, storage };
