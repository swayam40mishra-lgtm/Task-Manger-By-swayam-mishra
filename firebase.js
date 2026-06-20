import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";
const firebaseConfig = {
  apiKey: "AIzaSyDUguCeGfZzOUp6myEhqXLoiQbTj-ItqhM",
  authDomain: "muskan-651cb.firebaseapp.com",
  projectId: "muskan-651cb",
  storageBucket: "muskan-651cb.firebasestorage.app",
  messagingSenderId: "1032658969016",
  appId: "1:1032658969016:web:59fc6a1514708bf5d3af4d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { db, messaging };

