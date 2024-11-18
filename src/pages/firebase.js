// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Optional: for storing files
import { getMessaging } from "firebase/messaging"; // Optional: for messaging

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeqiegCqznKbLXAvxICgkqAGYHa_FlUdA",
  authDomain: "stock-react-30344.firebaseapp.com",
  projectId: "stock-react-30344",
  storageBucket: "stock-react-30344.firebasestorage.app",
  messagingSenderId: "995467052850",
  appId: "1:995467052850:web:0c2265c1b8e3a0c2f8f92b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Optional
export const messaging = getMessaging(app); // Optional
export default app;
