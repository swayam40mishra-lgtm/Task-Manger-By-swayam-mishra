importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDUguCeGfZzOUp6myEhqXLoiQbTj-ItqhM",
  authDomain: "muskan-651cb.firebaseapp.com",
  projectId: "muskan-651cb",
  storageBucket: "muskan-651cb.firebasestorage.app",
  messagingSenderId: "1032658969016",
  appId: "1:1032658969016:web:59fc6a1514708bf5d3af4d"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

    self.registration.showNotification(
        payload.notification.title,
        {
            body: payload.notification.body,
            icon: "/icon-192.png",
            badge: "/icon-192.png"
        }
    );

});
